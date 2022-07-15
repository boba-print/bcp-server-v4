export interface CardDto {
  userId: string;
  cardId: string;
  createdAt: Date;
  modifiedAt: Date;
  rejectionMessage: string | null;
  maskedNumber: string;
  priority: number;
  vendorCode: string;
}
