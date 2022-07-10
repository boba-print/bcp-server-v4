import { Injectable } from '@nestjs/common';
import { Files } from '@prisma/client';
import { PrintJobErrorType } from '../types/PrintJobErrorType';

@Injectable()
export class FileMapper {
  mapFromRelation(files: Files) {
    return {
      id: files.FileID,
      createdAt: files.CreatedAt,
      modifiedAt: files.ModifiedAt,
      name: files.ViewName,
      size: files.Size,
      isConverted: !!files.FileConvertedID,
      errorType: this.errorTypeToEnum(files.ErrorType),
    };
  }

  private errorTypeToEnum(errorType: string | null) {
    switch (errorType) {
      case 'unknown':
        return PrintJobErrorType.Unknown;
      case 'encrypted-file':
        return PrintJobErrorType.EncryptedFile;
      case 'BrokenFile':
        return PrintJobErrorType.BrokenFile;
      case 'LowPdfVersion':
        return PrintJobErrorType.LowPdfVersion;
      default:
        return null;
    }
  }
}
