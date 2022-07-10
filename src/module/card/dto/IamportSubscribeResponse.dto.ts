export interface IamportSubscribeResponseDto {
  code: number;
  message: string;
  response: {
    customer_uid: string;
    pg_provider: string;
    pg_id: string;
    customer_id: string;
    card_name: string;
    card_code: string;
    card_number: string;
    card_type: null;
    customer_name: string;
    customer_tel: string;
    customer_email: string;
    customer_addr: string;
    customer_postcode: string;
    inserted: number;
    updated: number;
  };
}
