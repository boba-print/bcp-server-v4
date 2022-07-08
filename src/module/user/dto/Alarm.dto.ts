import { AlarmContext } from 'src/domain/Alarm/AlarmContext';

export interface Alarm {
  addedAt: Date;
  contents: string;
  context: AlarmContext;
  uid: string;
  hasRead: boolean;
  detailUid: string;
}
