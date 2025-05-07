import {
  updateAuditTrail,
  updateErrorAuditTrail,
} from "../lib/auditTrailSave.js";
import { encryptData, getPath } from "../util/util.js";
import fs from "fs";
const bodyEncrypt = async (req, res, pay) => {
  const err = null;
  const cookies = { ...req.cookies };
  let p = getPath("/authentication/pathThatDontNeedAuth.json");
  let PTDNA = JSON.parse(fs.readFileSync(p, "utf8"));
  let findNoP = PTDNA.find((x) => {
    let regex = new RegExp(x.path.toString(), "i").test(req.url.toString());
    if (regex && x.method.toLowerCase() === req.method.toLowerCase()) return x;
  });
  if (res.statusCode >= 400) {
    // done(null, pay);
    await updateErrorAuditTrail(req, pay);
    return pay;
  } else if (findNoP) {
    // done(err, pay);

    return pay;
  } else {
    if (cookies.cookie_pb_1271) {
      let a = encryptData(pay, cookies.cookie_pb_1271);
      if (req.audit_trail) {
        updateAuditTrail(req, pay);
      }

      return a;
      // done(err, JSON.stringify(a));
    } else {
      // throw error;
      if (req.method !== "OPTIONS") return payload;

      // done(err, null);
    }
  }
};
export default bodyEncrypt;
