import AuditTrail from "../models/AuditTrail.js";
import { decryptData, getPath } from "../util/util.js";
import Ac from "../routes/AuditTrail/lib/AuditTrail.class.js";
import fs from "fs";
const bodyChecker = async (req, res) => {
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
        req.body = JSON.parse(a);
        // const keysToCheckOfItsOnlyFetch = ["limit", "offset", "sort", "filter"];
        // const hasAllKeys = keysToCheckOfItsOnlyFetch.every(
        //   (key) => key in req.body
        // );
        // // save audit trail here if not fetch kind of post

        // if (!hasAllKeys) {
        //   let saveTrail = await ac.Insert({ performedBy: req.user_id,targetId });
        // }
        if (req.url.includes("create")) console.log(req.url, "her");
      }
    }
  } catch (err) {
    throw err;
  }
};
const acceptedMethods = ["POST", "DELETE", "PUT", "POST"];
export default bodyChecker;
