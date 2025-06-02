import AuditTrail from "../models/AuditTrail.js";
import { decryptData, getPath } from "../util/util.js";
import Ac from "../routes/AuditTrail/lib/AuditTrail.class.js";
import fs from "fs";
import { auditTrailSave } from "../lib/auditTrailSave.js";
const bodyChecker = async (req, res) => {
  try {
    console.log("here");
    let formHeader = req.headers["content-type"]?.includes(
      "multipart/form-data;"
    );
    let p = getPath("/authentication/pathThatDontNeedAuth.json");
    let PTDNA = JSON.parse(fs.readFileSync(p, "utf8"));
    let findNoP = PTDNA.find((x) => {
      let regex = new RegExp(x.path.toString(), "i").test(req.url.toString());
      if (regex && x.method.toLowerCase() === req.method.toLowerCase())
        return x;
    });

    if (findNoP === undefined) {
      if (req.method === "POST" && !req.body && !formHeader)
        throw new Error("ErrorCODE X2");
      if (req.method === "PUT" && !req.body && !formHeader)
        throw new Error("ErrorCODE X3");
      if (req.method === "DELETE" && !req.body && !formHeader)
        throw new Error("ErrorCODE X4");
      if (req.method.includes(acceptedMethods))
        throw new Error("ErrorCODE X41");
      if (req.method !== "GET" && !formHeader) {
        const cookie = req.cookies.cookie_pb_1271;

        let a = decryptData(req.body.data, cookie);

        if (!a) throw new Error("ErrorCODE X891");
        let body = JSON.parse(a);

        req.body = body;
        let auditTrailId = await auditTrailSave(req, body);
        if (auditTrailId) req.audit_trail = auditTrailId;
      }

      if (req.method !== "GET" && formHeader) {
        const cookie = req.cookies.cookie_pb_1271;

        let a = decryptData(req.body.data.value, cookie);
        const file = req.body.file;
        if (!a) throw new Error("ErrorCODE X891");
        req.body = { ...JSON.parse(a), file };
      }
    }
  } catch (err) {
    throw err;
  }
};
const acceptedMethods = ["POST", "DELETE", "PUT", "POST"];
export default bodyChecker;
