import {
  insertImageSchema,
  updateImageSchema,
  getSchema,
  serveImageSchema,
} from "./Schema/File.Schema.js";
import bodyChecker from "../../helpers/bodyChecker.js";
import { auth } from "../../authentication/auth.js";
import bodyEncrypt from "../../helpers/bodyEncrypt.js";
import { decryptData } from "../../util/util.js";

const file = (app, opts, done) => {
  app.addHook("preHandler", async (req, reply) => {
    if (req.body?.data) {
      const cookie = req.cookies.cookie_pb_1271;
      const decrypted = decryptData(req.body.data.value, cookie);
      if (!decrypted) throw new Error("Decryption failed");

      const dec = JSON.parse(decrypted);
      req.body = { ...dec, file: req.body.file };

      // Attach files if any (already in req.body.file from multipart)
    }
  });

  app.post("/image", insertImageSchema);
  app.put("/image", updateImageSchema);
  app.post("/", getSchema);
  app.get("/serve/image/:id", serveImageSchema);
  done();
};

export default file;
