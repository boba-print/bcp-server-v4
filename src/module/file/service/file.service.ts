import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class FileService {
  constructor(private readonly prismaService: PrismaService) {}

  async update(id: string, name: string) {
    const file = await this.prismaService.files.update({
      where: {
        FileID: id,
      },
      data: {
        ViewName: name,
      },
    });

    return file;
  }
}
