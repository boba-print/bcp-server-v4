import { AlarmContext } from './AlarmContext';

export interface AlarmProps {
  addedAt: Date;
  contents: string;
  context: AlarmContext;
  uid: string;
  hasRead: boolean;
  detailUid: string;
}
