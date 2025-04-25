import auditTrailSave from "../lib/auditTrailSave.js";
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
    return pay;
  } else if (findNoP) {
    // done(err, pay);
    return pay;
  } else {
<<<<<<< HEAD
    if (cookies.cookie_pb_1271) {
      let a = encryptData(pay, cookies.cookie_pb_1271);
      auditTrailSave(req, pay);
      return a;
      // done(err, JSON.stringify(a));
    } else {
      // throw error;
      if (req.method !== "OPTIONS") return payload;

      // done(err, null);
=======
    const contentType = res.getHeader("Content-Type");
    // ✅ If it's a file/stream response — skip encryption
    if (
      contentType?.includes("application/octet-stream") ||
      (pay && typeof pay.pipe === "function") // detects streams
    ) {
      console.log(">>>>>>>>>>>", pay.pipe);

      done(err, pay);
    } else {
      if (cookies.cookie_pb_1271) {
        console.log(pay);
        let a = encryptData(pay, cookies.cookie_pb_1271);
        return a;
        // done(err, JSON.stringify(a));
      } else {
        // throw error;
        if (req.method !== "OPTIONS") throw new Error("no cookies found");
        // done(err, null);
      }
>>>>>>> 9cafc56034111830b0cc840c38a611911a3213ec
    }
  }
};
export default bodyEncrypt;
