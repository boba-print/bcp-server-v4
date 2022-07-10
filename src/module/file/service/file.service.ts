import { Injectable, NotFoundException } from '@nestjs/common';
import { NotFoundError } from 'src/common/error';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class FileService {
  constructor(private readonly prismaService: PrismaService) {}

  async update(params: any, name: string) {
    const result = await this.prismaService.files.findFirst({
      where: {
        FileID: params.fileId,
        UserID: params.userId,
        IsDeleted: 0,
      },
    });

    if (!result) {
      throw new NotFoundError('not found!!');
    }

    const file = await this.prismaService.files.update({
      where: {
        FileID: params.fileId,
      },
      data: {
        ViewName: name,
      },
    });

    return file;
  }
}
