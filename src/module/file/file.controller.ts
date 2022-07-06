import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'src/common/guard/UserAuth.guard';
import { PrismaService } from 'src/service/prisma.service';

@Controller('users')
export class FileController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get(':userId/files')
  @UseGuards(UserAuthGuard)
  async findMany(@Param('userId') userId: string, @Query('n') n: string) {
    let numLimit = parseInt(n);
    if (isNaN(numLimit)) {
      console.warn(
        '[UserController.findUserFiles] parsing number error, set to default 10',
      );
      numLimit = 10;
    }

    const files = await this.prismaService.files.findMany({
      where: {
        UserID: userId,
      },
      take: numLimit,
      orderBy: {
        CreatedAt: 'desc',
      },
    });

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
}
