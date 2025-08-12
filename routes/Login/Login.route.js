import {
  checkSessionSchema,
  getMyDetailsSchema,
  LoginSchema,
  loginUsingMobileNumberSchema,
  mobileNumberSchmea,
} from "./Schema/Login.Schema.js";

const LoginRoute = (app, opts, done) => {
  app.post("/", LoginSchema);
  app.get("/", getMyDetailsSchema);
  app.get("/checkSession", checkSessionSchema);
  app.post("/mobileLogin", mobileNumberSchmea);
  app.post("/loginUsingMobileNumber", loginUsingMobileNumberSchema);
  done();
};
export default LoginRoute;
