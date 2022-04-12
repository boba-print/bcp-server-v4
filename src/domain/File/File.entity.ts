export interface FileProps {
  FileID: string;
  CreatedAt: Date;
  ModifiedAt: Date;
  IsDeleted: number;
  OriginalGSPath: string;
  OriginalName: string;
  ViewName: string;
  Size: number;
  UserID: string;
  FileConvertedID: string | null;
  ErrorType: string | null;
  FilesConverted: FileConvertedProps | null;
}

interface FileConvertedProps {
  FileConvertedID: string;
  CreatedAt: Date;
  Orientation: string;
  NumPages: number;
  ThumbnailsGSPath: string;
  ConvertedFileGSPath: string;
  UserID: string;
}

export class FileEntity {
  props: FileProps;
  constructor(props: FileProps) {
    this.props = props;
  }
}
