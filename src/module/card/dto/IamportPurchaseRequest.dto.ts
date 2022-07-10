export interface IamportPurchaseRequestDto {
  customer_uid: string;
  merchant_uid: string; // 가맹점 관리 결제 고유번호
  amount: number;
  name: string; // 주문 명
  buyer_name?: string;
  buyer_email?: string;
  buyer_tel?: string;
}
