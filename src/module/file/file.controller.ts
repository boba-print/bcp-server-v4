import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NotFoundError } from 'src/common/error';
import { UserAuthGuard } from 'src/common/guard/UserAuth.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { PrismaService } from 'src/service/prisma.service';
import { UpdateFileDto } from './dto/UpdateFile.dto';
import { FileService } from './service/file.service';

@Controller('users/:userId')
export class FileController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService,
  ) {}

  @Get('files')
  @UseGuards(UserAuthGuard)
  async findMany(@Param('userId') userId: string) {
    const files = await this.prismaService.files.findMany({
      where: {
        UserID: userId,
        IsDeleted: 0,
      },
    });

    if (!files.length) {
      throw new NotFoundError('not found!!');
    }

    return files;
  }

  @Get('files/upload-token')
  @UseGuards(UserAuthGuard)
  async getUploadToken(
    @Req() req: UserAuthRequest,
    @Query('uploadPath') uploadPath: URL,
  ) {
    const user = req.user;
    const token = await this.fileService.generateUploadToken(user, uploadPath);
    return token;
  }

  @Get('files/images')
  @UseGuards(UserAuthGuard)
  async getFileImages(
    @Param('userId') userId: string,
    @Query('prefix') prefix: string,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    let startDefault: number;
    let endDefault: number;
    startDefault = parseInt(start);
    endDefault = parseInt(end);
    if (isNaN(startDefault)) {
      console.warn('[start] parsing number error, set to default 0');
      startDefault = 0;
    }
    // endDefault의 경우 service에서 convertedFile의 numPages로 초기화가 됩니다. controller 에서 초기화되는 것이 옳은 것같아 옮깁니다.
    // start = 0, end = 0 인 경우에만 한장만 출력됩니다.
    if (isNaN(endDefault)) {
      const numPage = await this.prismaService.filesConverted.findFirst({
        where: {
          ThumbnailsGSPath: prefix,
        },
        select: {
          NumPages: true,
        },
      });
      if (!numPage) {
        throw new HttpException('Not Found!!', 404);
      }
      endDefault = numPage.NumPages - 1;
    }
    const result = await this.prismaService.filesConverted.findFirst({
      where: {
        ThumbnailsGSPath: prefix,
        UserID: userId,
      },
    });
    if (!result) {
      throw new HttpException('unAuthorized', 403);
    }

    const signedURLs = await this.fileService.getSignedURL(
      prefix,
      startDefault,
      endDefault,
    );
    return signedURLs;
  }

  @Get('files/:fileId')
  @UseGuards(UserAuthGuard)
  async findOne(@Param() params) {
    const file = await this.prismaService.files.findFirst({
      where: {
        UserID: params.userId,
        FileID: params.fileId,
        IsDeleted: 0,
      },
    });
    return file;
  }

  @Patch('files/:fileId')
  @UseGuards(UserAuthGuard)
  async patch(@Param() params, @Body() body: any) {
    const dto = plainToInstance(UpdateFileDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new HttpException(errors[0].toString(), 400);
    }
    if (!dto.name) {
      throw new HttpException('Badly formed', 400);
    }
    const file = await this.fileService.update(params, dto.name);

    return file;
  }

  @Delete('files/:fileId')
  @UseGuards(UserAuthGuard)
  async remove(@Param() params) {
    const result = await this.prismaService.files.findFirst({
      where: {
        FileID: params.fileId,
        UserID: params.userId,
        IsDeleted: 0,
      },
    });

    if (!result) {
      throw new HttpException('No file', 404);
    }

    const file = await this.prismaService.files.update({
      where: {
        FileID: params.fileId,
      },
      data: {
        IsDeleted: 1,
      },
    });
    return file;
  }
}
