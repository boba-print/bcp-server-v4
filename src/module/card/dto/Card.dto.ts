export interface CardDto {
  UserID: string;
  CardID: string;
  CreatedAt: Date;
  ModifiedAt: Date;
  RejectionMessage: string | null;
  MaskedNumber: string;
  Priority: number;
  VendorCode: string;
}
