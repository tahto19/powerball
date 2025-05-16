import fs from "fs";
import path from "path";
import { decryptPassword, getPath } from "../util/util.js";

import cookieChecker from "./helper/cookieChecker.js";
export const auth = async (req, res) => {
  try {
    // this part is where check if the post has body

    // authentication below
    let p = getPath("/authentication/pathThatDontNeedAuth.json");
    console.log(p);
    let PTDNA = JSON.parse(fs.readFileSync(p, "utf8"));
    let findNoP = PTDNA.find((x) => {
      console.log(req.url);
      let regex = new RegExp(x.path.toString(), "i").test(req.url.toString());
      console.log(regex);
      console.log(req.method);
      if (regex && x.method.toLowerCase() === req.method.toLowerCase())
        return x;
    });
    console.log("findNoP", findNoP);
    if (findNoP === undefined) {
      // check adminPaths
      let AdminP = getPath("/authentication/adminPath.json");
      let readAdminP = JSON.parse(fs.readFileSync(AdminP, "utf8"));
      let findNoAP = readAdminP.find((x) => {
        let regex = new RegExp(x.path.toString(), "i").test(req.url.toString());
        if (regex) return x;
      });
      let c_checkerDetails = await cookieChecker(req);
      req.user_id = c_checkerDetails.id;
      // if admin paths found check for the cookieChecker if the user is admin
      if (findNoAP) {
        console.log(c_checkerDetails);
      }
    } else {
    }
  } catch (err) {
    throw err;
  }
};
