import {
  createOTPForPasswordSchema,
  createOTPSchema,
  verifyCodeSchema,
} from "./Schema/OTP.schema.js";

const OTPRoute = (app, opts, done) => {
  app.get("/changePassword", createOTPForPasswordSchema);
  app.post("/verify", verifyCodeSchema);
  app.post("/", createOTPSchema);
  done();
};
export default OTPRoute;
