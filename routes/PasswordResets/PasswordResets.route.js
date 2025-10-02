import {
  forgetPasswordSchema,
  resetPasswordSchema,
  resetPasswordOTPSchema,
  verifyResetPasswordOTPSchema,
} from "./Schema/PasswordResets.Schema.js";
const passwrod_resets = (app, opts, done) => {
  app.post("/reset", forgetPasswordSchema);
  app.post("/confirm", resetPasswordSchema);

  app.post("/reset-password-otp", resetPasswordOTPSchema);
  app.post("/verify-reset-password-otp", verifyResetPasswordOTPSchema);

  done();
};

export default passwrod_resets;
