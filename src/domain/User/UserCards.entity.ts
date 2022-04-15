interface UserCardProps {
  CardID: string;
  CreatedAt: Date;
  ModifiedAt: Date;
  IsDeleted: number;
  CheckSum: string;
  RejectionMessage: string | null;
  MaskedNumber: string;
  Priority: number;
  VendorCode: string;
  BillingKey: string;
  UserID: string;
}

export class UserCardsEntity {
  props: UserCardProps[];
  constructor(props: UserCardProps[]) {
    this.props = props;
  }
}
