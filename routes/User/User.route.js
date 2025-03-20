import { getSchema, insertSchema, updateSchema } from "./Schema/User.Schema.js";

const users = (app, opts, done) => {
  app.get("/", getSchema);
  app.post("/", insertSchema);
  app.put("/", updateSchema);
  done();
};
export default users;
