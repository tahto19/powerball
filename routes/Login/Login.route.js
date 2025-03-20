import { getMyDetailsSchema, LoginSchema } from "./Schema/Login.Schema.js";

const LoginRoute = (app, opts, done) => {
  app.post("/", LoginSchema);
  app.get("/", getMyDetailsSchema);
  done();
};
export default LoginRoute;
