import { PrintOrderEntity } from '../PrintOrder/PrintOrder.entity';
import { AlarmProps } from './AlarmProps';
import { AlarmContext } from './AlarmContext';
import { v4 as uuidv4 } from 'uuid';

export class AlarmEntity {
  props: AlarmProps;

  /**
   * print order 에서 alarm entity 생성
   * @param printOrder print order entity
   * @param lastReadAt 마지막으로 공지를 확인한 시각
   */
  constructor(printOrder: PrintOrderEntity, lastReadAt: Date) {
    // printJob 하나에 파일 하나가 매핑되어있으므로 print job 의 개수를 세면 됨.
    const numFiles = printOrder.props.PrintOrder_PrintJob.length;
    const firstJobName =
      printOrder.props.PrintOrder_PrintJob[0].PrintJobs.Files.ViewName;

    const props = {
      addedAt: printOrder.props.CreatedAt,
      contents:
        numFiles <= 1 ? firstJobName : firstJobName + ` 외 ${numFiles}건`,
      context: AlarmContext.Print,
      uid: uuidv4(),
      hasRead: lastReadAt > printOrder.props.CreatedAt,
      detailUid: printOrder.props.PrintOrderID,
    };
    this.props = props;
  }
  // TODO: 다른 형식의 알람들도 받을 수 있게 오버로딩 해야 함.

  toDto() {
    return { ...this.props };
  }
}
