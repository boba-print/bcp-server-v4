import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class GCSService {
  private storage = new Storage();

  parseBucketName(gsPath: string) {
    const url = new URL(gsPath);
    return url.hostname;
  }

  parseObjectName(gsPath: string) {
    const url = new URL(gsPath);
    return url.pathname;
  }

  async getObjectUrl(gsPath: string) {
    const bucket = this.storage.bucket(this.parseBucketName(gsPath));
    const file = bucket.file(this.parseObjectName(gsPath));
    return file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60,
    });
  }

  async getObjectList(gsPath: string) {
    const bucketName = this.parseBucketName(gsPath);
    const bucket = this.storage.bucket(bucketName);
    const files = await bucket.getFiles({
      prefix: this.parseObjectName(gsPath),
    });
    return files[0]
      .map((file) => file.name)
      .map((name) => `gs://${bucketName}/${name}`);
  }

  async getObjectUrls(gsPrefix: string) {
    const objectList = await this.getObjectList(gsPrefix);
    return Promise.all(objectList.map((gsPath) => this.getObjectUrl(gsPath)));
  }
}
