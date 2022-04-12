import { PrintJobEntity } from "../PrintJob/PrintJob.entity";

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

class KioskEntity {
  props: KioskProps;
  constructor(props: KioskProps) {
    this.props = props;
  }

  calcPrice(printJob: PrintJobEntity) {
    const { PriceA4Mono, PriceA4Color } = this.props;
    // 1. 컬러 흑백 모두 지원
    if(PriceA4Mono >= 0 && PriceA4Color >=0) {
      if(printJob)
    }
    // 2. 흑백 지원
    
    // 3. 컬러 지원

    // 4. 둘 다 지원 안함
  }
}