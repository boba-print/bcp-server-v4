import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class GCSService {
  private storage = new Storage();

  bucket(gsUrl: URL) {
    return gsUrl.hostname;
  }

  name(gsUrl: URL) {
    return gsUrl.pathname.slice(1);
  }

  async getObjectUrl(gsUrl: URL) {
    const bucket = this.storage.bucket(this.bucket(gsUrl));
    const file = bucket.file(this.name(gsUrl));
    const response = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60,
    });
    return response[0];
  }

  async getObjectList(gsUrl: URL) {
    const bucketName = this.bucket(gsUrl);
    const bucket = this.storage.bucket(bucketName);
    const files = await bucket.getFiles({
      prefix: this.name(gsUrl),
    });

    return files[0].map((file) => {
      const gsPath = `gs://${file.bucket.name}/${file.name}`;
      return new URL(gsPath);
    });
  }

  async getObjectUrls(gsUrl: URL) {
    const objectList = await this.getObjectList(gsUrl);
    return Promise.all(objectList.map((gsUrl) => this.getObjectUrl(gsUrl)));
  }
}
