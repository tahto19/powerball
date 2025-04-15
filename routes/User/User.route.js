import {
  createUserSchema,
  getSchema,
  insertSchema,
  updateSchema,
} from "./Schema/User.Schema.js";

const users = (app, opts, done) => {
  app.post("/admin", getSchema);
  app.post("/createUser", createUserSchema);
  app.post("/users", getSchema);
  app.post("/", insertSchema);
  app.put("/", updateSchema);

  done();
};
export default users;
