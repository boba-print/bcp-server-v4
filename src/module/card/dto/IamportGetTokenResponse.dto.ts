export interface IamportGetTokenResponse {
  code: number;
  message: string;
  response: {
    access_token: string;
    expired_at: number;
    now: number;
  };
}
