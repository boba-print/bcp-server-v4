import { Kiosks } from '@prisma/client';

// # TODO: Props 를 풀어놓는것이 나을지?
export class KioskEntity {
  private props: Kiosks;
  constructor(props: Kiosks) {
    this.props = props;
  }

  heartbeat() {
    this.props.LastConnectedAt = new Date();
  }

  supplyPaper() {
    this.props.NumRemainPaper = this.props.PaperTrayCapacity;
  }

  toObj() {
    return this.props;
  }
}
