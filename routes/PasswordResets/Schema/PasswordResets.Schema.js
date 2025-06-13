import {
  forgotPassword,
  resetPassword,
} from "../Controller/PasswordResets.Controller.js";

export const forgetPasswordSchema = {
  handler: forgotPassword,
};

export const resetPasswordSchema = {
  handler: resetPassword,
};
