import { PrintOrderEntity } from '../PrintOrder/PrintOrder.entity';
import { AlarmProps } from './AlarmProps';
import { AlarmContext } from './AlarmContext';
import { v4 as uuidv4 } from 'uuid';

export class AlarmEntity {
  props: AlarmProps;

  constructor(printOrder: PrintOrderEntity, lastReadAt: Date) {
    // printJob 하나에 파일 하나가 매핑되어있으므로 print job 의 개수를 세면 됨.
    const numFiles = printOrder.props.PrintOrder_PrintJob.length;
    const firstJobName =
      printOrder.props.PrintOrder_PrintJob[0].PrintJobs.Files.ViewName;

    this.props.addedAt = printOrder.props.CreatedAt;
    this.props.contents =
      numFiles <= 1 ? firstJobName : firstJobName + ` 외 ${numFiles}건`;
    this.props.context = AlarmContext.Print;
    this.props.uid = uuidv4();
    this.props.hasRead = lastReadAt > this.props.addedAt; // 추가된 시간보다 읽은 시간이 나중이면
    this.props.detailUid = printOrder.props.PrintOrderID;
  }
  // TODO: 다른 형식의 알람들도 받을 수 있게 오버로딩 해야 함.
}
