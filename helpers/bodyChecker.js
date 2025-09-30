import AuditTrail from "../models/AuditTrail.js";
import { decryptData, getPath } from "../util/util.js";
import Ac from "../routes/AuditTrail/lib/AuditTrail.class.js";
import fs from "fs";
import { auditTrailSave } from "../lib/auditTrailSave.js";
import { Readable } from "stream";
const bodyChecker = async (req, res, payload) => {
  try {
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
    let parsed = false;
    if (findNoP === undefined) {
      const chunks = [];
      if (!formHeader) {
        for await (const chunk of payload) {
          chunks.push(chunk);
        }
        const rawBody = Buffer.concat(chunks).toString("utf8");

        parsed = rawBody === "" ? false : JSON.parse(rawBody);
      }
      if (req.method === "POST" && !parsed && !formHeader)
        throw new Error("ErrorCODE X2");
      if (req.method === "PUT" && !parsed && !formHeader)
        throw new Error("ErrorCODE X3");
      if (req.method === "DELETE" && !parsed && !formHeader)
        throw new Error("ErrorCODE X4");
      if (req.method.includes(acceptedMethods))
        throw new Error("ErrorCODE X41");
      if (req.method !== "GET" && !formHeader) {
        const cookie = req.cookies.cookie_pb_1271;

        let a = decryptData(parsed.data, cookie);

        if (!a) throw new Error("ErrorCODE X891");
        let body = JSON.parse(a);
        const byteLength = Buffer.byteLength(a, "utf8");
        req.headers["content-length"] = byteLength.toString();

        let auditTrailId = await auditTrailSave(req, body);
        if (auditTrailId) req.audit_trail = auditTrailId;
        return Readable.from([a]);
      }

      if (req.method !== "GET" && formHeader) {
        // const cookie = req.cookies.cookie_pb_1271;
        // let a = decryptData(parsed.data.value, cookie);
        // const file = parsed.file;
        // if (!a) throw new Error("ErrorCODE X891");
        // let body = JSON.parse(a);
        // const byteLength = Buffer.byteLength(a, "utf8");
        // req.headers["content-length"] = byteLength.toString();
        // return Readable.from([a]);
        // parsed = { ...JSON.parse(a), file };
      }
      const secure = req.headers["secure"];

      if (req.method === "GET" && secure === "true") {
        // let body = JSON.parse(a);
        const { data } = req.query;
        let decryptData_ = decryptData(data, req.cookies.cookie_pb_1271);
        req.query = JSON.parse(decryptData_);
      }
    }
  } catch (err) {
    throw err;
  }
};
const acceptedMethods = ["POST", "DELETE", "PUT", "POST"];
export default bodyChecker;
