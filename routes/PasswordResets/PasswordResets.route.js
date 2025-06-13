import {
  forgetPasswordSchema,
  resetPasswordSchema,
} from "./Schema/PasswordResets.Schema.js";
const passwrod_resets = (app, opts, done) => {
  app.post("/reset", forgetPasswordSchema);
  app.post("/confirm", resetPasswordSchema);

  done();
};

export default passwrod_resets;
