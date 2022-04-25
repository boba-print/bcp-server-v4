import {
  CardTransactions,
  Files,
  FilesConverted,
  Kiosks,
  PointTransactions,
  PrintJobs,
  PrintOrders,
  PrintOrder_PrintJob,
} from '@prisma/client';

type PrintOrderProps = PrintOrders & {
  PrintOrder_PrintJob: (PrintOrder_PrintJob & {
    PrintJobs: PrintJobs & {
      Files: Files & {
        FilesConverted: FilesConverted | null;
      };
    };
  })[];
  Kiosks: Kiosks;
  CardTransactions: CardTransactions | null;
  PointTransactions: PointTransactions | null;
};

export class PrintOrderEntity {
  props: PrintOrderProps;
  constructor(props: PrintOrderProps) {
    this.props = props;
  }
}
