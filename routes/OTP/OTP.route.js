import { createOTPSchema, verifyCodeSchema } from "./Schema/OTP.schema.js";

const OTPRoute = (app, opts, done) => {
  app.post("/", createOTPSchema);
  app.post("/verify", verifyCodeSchema);
  done();
};
export default OTPRoute;
