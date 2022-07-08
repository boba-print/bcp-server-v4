import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserAuthGuard } from 'src/common/guard/UserAuth.guard';
import { PrismaService } from 'src/service/prisma.service';
import { UpdateFileDto } from './dto/UpdateFile.dto';
import { FileService } from './service/file.service';

@Controller('users')
export class FileController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService,
  ) {}

  @Get(':userId/files')
  @UseGuards(UserAuthGuard)
  async findMany(@Param('userId') userId: string) {
    const files = await this.prismaService.files.findMany({
      where: {
        UserID: userId,
      },
    });

    if (!files) {
      throw new HttpException('No files', 404);
    }

    return files;
  }

  @Get(':userId/files/:fileId')
  @UseGuards(UserAuthGuard)
  async findOne(@Param() params) {
    const file = await this.prismaService.files.findFirst({
      where: {
        UserID: params.userId,
        FileID: params.fileId,
      },
    });

    return file;
  }

  @Patch(':userId/files/:fileId')
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

  @Delete(':userId/files/:fileId')
  @UseGuards(UserAuthGuard)
  async remove(@Param() params) {
    const result = await this.prismaService.files.findFirst({
      where: {
        FileID: params.fileId,
        UserID: params.userId,
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
