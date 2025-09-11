import {
  insertSiteDefaultsSchema,
  getMediaBannerSchema,
} from "./Schema/siteDefaults.Schema.js";
import { decryptData } from "../../util/util.js";

const siteDefaults = (app, opts, done) => {
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

  app.post("/insert", insertSiteDefaultsSchema);
  app.get("/media-banner", getMediaBannerSchema);

  done();
};
export default siteDefaults;
