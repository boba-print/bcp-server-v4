import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { prependOnceListener } from 'process';
import { KioskAuthRequest } from 'src/common/interface/AuthRequest';
import { KioskEntity } from 'src/domain/Kiosk/Kiosk.entity';
import { PrintJobEntity } from 'src/domain/PrintJob/PrintJob.entity';
import { UserEntity } from 'src/domain/User/User.entity';
import { PrismaService } from 'src/service/prisma.service';
import { CardPaymentFailedError } from '../errors';
import { GCSService } from '../service/GCS.service';
import { PrintOrderService } from '../service/PrintOrder.service';

// TODO: use guards
@Controller('print')
export class PrintController {
  // TODO: Add service
  constructor(
    private readonly prismaService: PrismaService,
    private readonly printOrderService: PrintOrderService,
    private readonly gcsService: GCSService,
  ) {}

  @Get(':verifyNumber')
  async findManyWithVerifyNumber(
    @Param('verifyNumber')
    verifyNumber: string,
    @Req()
    req: KioskAuthRequest,
  ) {
    const { kiosk } = req;

    // 키오스크의 인증번호에 해당하는 printJob들과 해당하는 파일들을 가져온다.
    const printJobs = await this.prismaService.printJobs.findMany({
      where: {
        KioskID: kiosk.KioskID,
        VerificationNumber: verifyNumber,
        IsDeleted: 0,
      },
      include: {
        Files: {
          include: {
            FilesConverted: true,
          },
        },
        Users: true,
        Kiosks: true,
      },
    });
    
    const printJobsDto = await Promise.all(
      printJobs.map(async (props) => ({
        ...props,
        Files: {
          ...props.Files,
          FilesConverted: {
            ...props.Files.FilesConverted,
            Url:
              props.Files.FilesConverted &&
              (await this.gcsService.getObjectUrl(
                new URL(props.Files.FilesConverted.ConvertedFileGSPath),
              )),
            ThumbnailUrls:
              props.Files.FilesConverted &&
              (await this.gcsService.getObjectUrls(
                new URL(props.Files.FilesConverted.ThumbnailsGSPath),
              )),
          },
        },
        Users: {
          ...props.Users,
          StorageAllocated: Number(props.Users.StorageAllocated),
          StorageUsed: Number(props.Users.StorageUsed),
        },
      })),
    );
    return printJobsDto;
  }

  @Post(':verifyNumber/checkout')
  async checkout(
    @Param('verifyNumber')
    verifyNumber: string,
    @Req()
    req: KioskAuthRequest,
  ) {
    const kiosk = new KioskEntity(req.kiosk);

    // 해당하는 printJob 을 쿼리한다.
    const printJobProps = await this.prismaService.printJobs.findMany({
      where: {
        KioskID: kiosk.props.KioskID,
        VerificationNumber: verifyNumber,
        IsDeleted: 0,
      },
      include: {
        Files: { include: { FilesConverted: true } },
        Kiosks: true,
        Users: true,
      },
    });
    const printJobs = printJobProps.map((props) => new PrintJobEntity(props));
    if (printJobs.length === 0) {
      throw new HttpException('Not Found', 404);
    }

    const user = new UserEntity(printJobProps[0].Users);
    const { cardTransaction, pointTransaction } = await kiosk
      .checkout(printJobs, user)
      .catch(async (err) => {
        if (err instanceof CardPaymentFailedError) {
          await this.onCardFailed(err);
          throw new HttpException(err.message, 400);
        }
        throw new HttpException(err.message, 500);
      });

    await this.printOrderService.persistPrintOrderResult(
      user,
      printJobs,
      cardTransaction,
      pointTransaction,
      kiosk,
    );
  }

  onCardFailed(err: CardPaymentFailedError) {
    err.card.RejectionMessage = err.message;
    return this.prismaService.cards.update({
      where: { CardID: err.card.CardID },
      data: err.card,
    });
  }
}
