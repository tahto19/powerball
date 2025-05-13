import { LogoutSchema } from "./Schema/Logout.Schema.js";

const LogoutRoute = (app, opts, done) => {
  app.post("/", LogoutSchema);
  done();
};
export default LogoutRoute;
