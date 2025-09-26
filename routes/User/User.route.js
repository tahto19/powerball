import {
  createUserSchema,
  getSchema,
  insertSchema,
  updateSchema,
  getUserSchema,
  verifyCodeAndUpdateUserSchema,
} from "./Schema/User.Schema.js";
import { decryptData } from "../../util/util.js";

const users = (app, opts, done) => {
  app.put("/verifyForChangePassword", verifyCodeAndUpdateUserSchema);
  app.addHook("preHandler", async (req, reply) => {
    if (req.routeOptions.method.toLowerCase() === "put" && req.body.data) {
      const cookie = req.cookies.cookie_pb_1271;
      const decrypted = decryptData(req.body.data.value, cookie);
      if (!decrypted) throw new Error("Decryption failed");

      const dec = JSON.parse(decrypted);
      req.body = { ...dec, file: req.body.file };
    }
  });

  app.post("/admin", getSchema);
  app.post("/createUser", createUserSchema);
  app.post("/users", getSchema);
  app.post("/", insertSchema);
  app.put("/", updateSchema);
  app.get("/", getUserSchema);

  done();
};
export default users;
