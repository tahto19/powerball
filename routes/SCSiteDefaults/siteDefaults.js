import {
  insertSiteDefaultsSchema,
  getMediaBannerSchema,
  updateSiteDefaultsSchema,
  getHighlightsSchema,
  deleteHighlightsSiteDefaultsSchema,
  updateHighlightsSchema,
  getHighlightsPlayserSideSchema,
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
  app.put("/update", updateSiteDefaultsSchema);
  app.get("/media-banner", getMediaBannerSchema);
  app.get("/highlights", getHighlightsSchema);
  app.post("/highlights/delete", deleteHighlightsSiteDefaultsSchema);
  app.put("/highlights/update", updateHighlightsSchema);
  app.get("/highlights/players", getHighlightsPlayserSideSchema);

  done();
};
export default siteDefaults;
