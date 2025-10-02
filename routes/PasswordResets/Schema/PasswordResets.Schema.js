import {
  forgotPassword,
  resetPassword,
  resetPasswordOTP,
  verifyResetPasswordOTP,
} from "../Controller/PasswordResets.Controller.js";

export const forgetPasswordSchema = {
  handler: forgotPassword,
};

export const resetPasswordSchema = {
  handler: resetPassword,
};

export const resetPasswordOTPSchema = {
  handler: resetPasswordOTP,
};

export const verifyResetPasswordOTPSchema = {
  handler: verifyResetPasswordOTP,
};
