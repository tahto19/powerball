import fs from "fs";
import path from "path";
import { decryptPassword, getPath } from "../util/util.js";

import cookieChecker from "./helper/cookieChecker.js";
export const auth = async (req, res) => {
  try {
    // this part is where check if the post has body

    // authentication below
    let p = getPath("/authentication/pathThatDontNeedAuth.json");
    let PTDNA = JSON.parse(fs.readFileSync(p, "utf8"));
    let findNoP = PTDNA.find((x) => {
      let regex = new RegExp(x.path.toString(), "i").test(req.url.toString());
      console.log(regex, x.method.toLowerCase())
      if (regex && x.method.toLowerCase() === req.method.toLowerCase())
        return x;
    });
    if (findNoP === undefined) {
      let c_checkerDetails = await cookieChecker(req);
    }
  } catch (err) {
    throw err;
  }
};
