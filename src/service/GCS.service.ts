import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class GCSService {
  private storage = new Storage();

  bucket(gsUrl: URL) {
    const url = new URL(gsUrl);
    return url.hostname;
  }

  name(gsUrl: URL) {
    const url = new URL(gsUrl);
    return url.pathname.slice(1);
  }

  async isExist(gsUrl: URL) {
    const bucket = this.storage.bucket(this.bucket(gsUrl));
    const file = bucket.file(this.name(gsUrl));
    const result = await file.exists();
    return result;
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
    console.log(files[0]);

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
