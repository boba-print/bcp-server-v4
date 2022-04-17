import {
  Files,
  FilesConverted,
  Kiosks,
  PrintJobs,
  Users,
} from '@prisma/client';

export type PrintJobDto = PrintJobs & {
  Users: Users;
  Kiosks: Kiosks;
  Files: Files & {
    FilesConverted: FilesConverted | null;
    Url: string;
    ThumbnailUrls: string[];
  };
};
