import { PrintJobEntity } from '../PrintJob/PrintJob.entity';
import { UserEntity } from '../User/User.entity';

export interface KioskProps {
  KioskID: string;
  CreatedAt: Date;
  ModifiedAt: Date;
  IsDeleted: number;
  Address: string;
  Latitude: number;
  Longitude: number;
  BuildingCode: string;
  LastConnectedAt: Date | null;
  MaintenancePasscode: string;
  Description: string;
  KioskMaintenanceGroupID: string | null;
  Group: string;
  ImageUrl: string | null;
  IsDuplexPrintable: number;
  MerchantID: string | null;
  Name: string;
  PriceA4Mono: number | null;
  PriceA4Color: number | null;
  BannerCustomHTML: string | null;
  Status: string;
  Notice: string | null;
  WorkHour: string;
  PaperTrayCapacity: number;
  NumRemainPaper: number;
  CurrentViewPage: string | null;
  Version: string | null;
  Memo: string | null;
}

export class KioskEntity {
  props: KioskProps;
  constructor(props: KioskProps) {
    this.props = props;
  }

  getPriceToCharge(printJob: PrintJobEntity) {
    const { PriceA4Mono, PriceA4Color } = this.props;

    let priceToCharge: number;
    // 1. 컬러 흑백 모두 지원
    if (typeof PriceA4Mono === 'number' && typeof PriceA4Color === 'number') {
      if (printJob.props.IsColor) {
        priceToCharge = PriceA4Color;
      } else {
        priceToCharge = PriceA4Mono;
      }
    }
    // 2. 흑백 지원
    else if (typeof PriceA4Mono === 'number') {
      priceToCharge = PriceA4Mono;
    }
    // 3. 컬러 지원
    else if (typeof PriceA4Color === 'number') {
      priceToCharge = PriceA4Color;
    }
    // 4. 둘 다 지원 안함
    else {
      throw new Error('Invalid price setting');
    }

    return priceToCharge;
  }

  getPrice(printJob: PrintJobEntity) {
    const priceToCharge = this.getPriceToCharge(printJob);
    const { NumPrintPages } = printJob.props;

    if (!NumPrintPages) {
      throw new Error('NumPrintPage is invalid');
    }

    return priceToCharge * NumPrintPages;
  }

  checkout(price: number, user: UserEntity) {
    const { Points } = user.props;

    
  }
}
