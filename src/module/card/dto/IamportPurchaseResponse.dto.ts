export interface IamportPurchaseResponseDto {
  code: 0;
  message: string;
  response: {
    imp_uid: string;
    merchant_uid: string;
    pay_method: string;
    channel: 'pc' | 'mobile' | 'api';
    pg_provider: string;
    emb_pg_provider: string;
    pg_tid: string;
    pg_id: string;
    escrow: true;
    apply_num: string;
    bank_code: string;
    bank_name: string;
    card_code: string;
    card_name: string;
    card_quota: 0;
    card_number: string;
    card_type: null;
    vbank_code: string;
    vbank_name: string;
    vbank_num: string;
    vbank_holder: string;
    vbank_date: 0;
    vbank_issued_at: 0;
    name: string;
    amount: 0;
    cancel_amount: 0;
    currency: string;
    buyer_name: string;
    buyer_email: string;
    buyer_tel: string;
    buyer_addr: string;
    buyer_postcode: string;
    custom_data: string;
    user_agent: string;
    status: 'ready';
    started_at: 0;
    paid_at: 0;
    failed_at: 0;
    cancelled_at: 0;
    fail_reason: string;
    cancel_reason: string;
    receipt_url: string;
    cancel_history: [
      {
        pg_tid: string;
        amount: 0;
        cancelled_at: 0;
        reason: string;
        receipt_url: string;
      },
    ];
    cancel_receipt_urls: [string];
    cash_receipt_issued: true;
    customer_uid: string;
    customer_uid_usage: 'issue';
  };
}
