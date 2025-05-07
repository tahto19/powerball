import {
  createUserSchema,
  getSchema,
  insertSchema,
  updateSchema,
  getUserSchema,
} from "./Schema/User.Schema.js";

const users = (app, opts, done) => {
  app.post("/admin", getSchema);
  app.post("/createUser", createUserSchema);
  app.post("/users", getSchema);
  app.post("/", insertSchema);
  app.put("/", updateSchema);
  app.get("/", getUserSchema);

  done();
};
export default users;
