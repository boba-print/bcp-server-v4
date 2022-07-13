import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { NotFoundError } from 'src/common/error';
import { PrismaService } from 'src/service/prisma.service';
import { v4 as uuidv4 } from 'uuid';

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

  async generateUploadToken(userId: string, type: string) {
    const user = await this.prismaService.users.findUnique({
      where: {
        UserID: userId,
      },
    });
    if (!user) {
      throw new NotFoundError('User Not Found!!');
    }
    const userStorageSize =
      user.StorageAllocated < 0 ? 0 : user.StorageAllocated;
    const storageLeftInByte = userStorageSize - user.StorageUsed;
    const uploadPath = await this.makeUploadPath(type, userId);
    const payload = {
      uploadPath,
      storageLeftInByte,
    };
    const token = await admin.auth().createCustomToken(userId, payload);
    return token;
  }

  async getImageURLs(userId: string) {
    const files = await this.prismaService.files.findMany({
      where: {
        UserID: userId,
        IsDeleted: 0,
      },
      select: {
        FilesConverted: {
          select: {
            ConvertedFileGSPath: true,
          },
        },
      },
    });
    if (!files) {
      throw new NotFoundError('file not found!!');
    }
    const ConvertedFileGSPathes = files.map((file) =>
      file.FilesConverted
        ? file.FilesConverted.ConvertedFileGSPath.slice(4)
        : null,
    );
    const imageURLs = ConvertedFileGSPathes.map(
      (ConvertedFileGSPath) =>
        `https://storage.googleapis.com${ConvertedFileGSPath}`,
    );
    return imageURLs;
  }

  private async makeUploadPath(ext: string, userId: string) {
    return `original/${userId}/${uuidv4()}.${ext}`;
  }
}
