import {
  checkSessionSchema,
  getMyDetailsSchema,
  LoginSchema,
} from "./Schema/Login.Schema.js";

const LoginRoute = (app, opts, done) => {
  app.post("/", LoginSchema);
  app.get("/", getMyDetailsSchema);
  app.get("/checkSession", checkSessionSchema);
  done();
};
export default LoginRoute;
