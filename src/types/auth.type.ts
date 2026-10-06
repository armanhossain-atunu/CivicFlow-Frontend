/** biome-ignore-all lint/style/useImportType: <explanation> */
// register
export type RegisterPayload = {
  name: string;
  contactNumber?: string;
  email: string;
  password: string;
  confirmPassword: string;
};

// login
export type LoginPayload = {
  email: string;
  password: string;
};

// reset password
export type ResetPasswordPayload = {
  email: string;
  otp: string;
  newPassword: string;
};

// verify email
export type VerifyEmailPayload = {
  email: string;
  otp: string;
};

// forgot password
export type ForgotPasswordPayload = {
  email: string;
};

// google login
export type GooglePayload = {
  idToken: string;
};

// complain form
export interface ICreateComplaint {
  title: string;
  description: string;
  categoryId: string;
  department: string;
  location: string;
}
