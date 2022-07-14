import { Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import * as admin from 'firebase-admin';
import { NotFoundError } from 'src/common/error';
import { GCSService } from 'src/service/GCS.service';
import { PrismaService } from 'src/service/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly gcsService: GCSService,
  ) {}

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

  async getSignedURL(fileId: string) {
    const file = await this.prismaService.files.findUnique({
      where: {
        FileID: fileId,
      },
      include: {
        FilesConverted: true,
      },
    });
    if (!file?.FilesConverted) {
      throw new NotFoundError('file not found!!');
    }
    const numPages = file.FilesConverted.NumPages;
    const thumnailURL = file.FilesConverted.ThumbnailsGSPath;
    let signedURLs = {};
    for (let i = 0; i < numPages; i++) {
      const uploadFilePath = new URL(thumnailURL + `/rendering.${i}.100.o.jpg`);
      const signedURL = await this.gcsService.getObjectUrl(uploadFilePath);
      signedURLs[i] = signedURL;
    }

    return signedURLs;
  }

  async generateUploadToken(user: Users, uploadPath: URL) {
    const uploadFilePath = new URL(uploadPath + '/rendering.0.100.o.jpg');
    const result = await this.gcsService.isExist(uploadFilePath);
    if (result[0]) {
      return;
    }
    const userStorageSize =
      user.StorageAllocated < 0 ? 0 : user.StorageAllocated;
    const storageLeftInByte = userStorageSize - user.StorageUsed;
    const payload = {
      uploadPath,
      storageLeftInByte,
    };
    const token = await admin.auth().createCustomToken(user.UserID, payload);
    return token;
  }
}
