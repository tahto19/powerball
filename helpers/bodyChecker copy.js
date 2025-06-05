import AuditTrail from "../models/AuditTrail.js";
import { decryptData, getPath } from "../util/util.js";
import Ac from "../routes/AuditTrail/lib/AuditTrail.class.js";
import fs from "fs";
import { auditTrailSave } from "../lib/auditTrailSave.js";
import { Readable } from "stream";
import Busboy from "busboy";
const bodyChecker = async (req, res, payload) => {
  try {
    let formHeader = req.headers["content-type"]?.includes(
      "multipart/form-data"
    );

    let p = getPath("/authentication/pathThatDontNeedAuth.json");
    let PTDNA = JSON.parse(fs.readFileSync(p, "utf8"));
    let findNoP = PTDNA.find((x) => {
      let regex = new RegExp(x.path.toString(), "i").test(req.url.toString());
      if (regex && x.method.toLowerCase() === req.method.toLowerCase())
        return x;
    });
    let parsed;
    if (findNoP === undefined) {
      if (formHeader) {
        parsed = await new Promise((resolve, reject) => {
          const busboy = Busboy({ headers: req.headers });
          const formData = {};
          const files = [];

          busboy.on("field", (fieldname, value) => {
            formData[fieldname] = value;
          });

          // Handle files
          busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
            const fileChunks = [];

            file.on("data", (chunk) => {
              fileChunks.push(chunk);
            });

            file.on("end", () => {
              const buffer = Buffer.concat(fileChunks);
              files.push({
                fieldname,
                filename,
                encoding,
                mimetype,
                buffer,
              });
            });
          });

          busboy.on("error", reject);

          busboy.on("finish", () => {
            try {
              const encrypted = formData.data;

              if (!encrypted)
                return reject(new Error("Missing encrypted data"));

              resolve({
                data: encrypted,
                file: files,
              });
            } catch (err) {
              reject(err);
            }
          });

          (req.raw || req).pipe(busboy); // ✅ Supports both raw and native request
        });
      } else {
        const chunks = [];

        for await (const chunk of payload) {
          chunks.push(chunk);
        }
        console.log(chunks);

        const rawBody = Buffer.concat(chunks).toString("utf8");
        console.log(rawBody);

        parsed = rawBody === "" ? false : JSON.parse(rawBody);
      }
      console.log(parsed);
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
        const cookie = req.cookies.cookie_pb_1271;

        let a = decryptData(parsed.data, cookie);
        console.log(a);
        if (!a) throw new Error("ErrorCODE X891");
        const byteLength = Buffer.byteLength(a, "utf8");
        req.headers["content-length"] = byteLength.toString();

        // const body = JSON.parse(a);
        // req.body = body;

        // // Attach uploaded file if present
        // if (parsed.file && parsed.file.length > 0) {
        //   req.body.file = parsed.file[0];
        // }

        // return; // no stream return!
        return Readable.from([a]);

        // parsed = { ...JSON.parse(a), file };
      }
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
const acceptedMethods = ["POST", "DELETE", "PUT", "POST"];
export default bodyChecker;
