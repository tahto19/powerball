export type veriyCode = {
  code: string;
  id: number | null;
  toastID?: number | null;
};
export type verifyAndChangePassword = {
  otp: string | null;
  password: string | null;
};
