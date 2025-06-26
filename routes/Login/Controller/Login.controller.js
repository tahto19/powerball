import cookieChecker from "../../../authentication/helper/cookieChecker.js";
import { cSend, decryptPassword, encrpytPassword } from "../../../util/util.js";
import UserClass from "../../User/lib/User.class.js";

export const LoginController = async (req, res) => {
  try {
    let a = await UserClass.FetchOne([
      {
        filter: encrpytPassword(req.body.email),
        type: "string",
        field: "emailAddress",
      },
    ]);
    if (a === null) throw new Error("ErrorCODE X999");
    let b = await a.validPassword(req.body.password);
    if (!b) throw new Error("ErrorCODE X999");
    let changeDetails = a.toJSON();

    delete changeDetails["password"];
    delete changeDetails["active"];
    delete changeDetails["block"];
    delete changeDetails["createdAt"];
    delete changeDetails["updatedAt"];
    delete changeDetails["deletedAt"];
    changeDetails["pm-scratch-it-m"] = req.headers["pm-scratch-it-m"];
    changeDetails["platformversion"] = req.headers["platformversion"];
    changeDetails["platform"] = req.headers["platform"];
    changeDetails["login"] = new Date();

    let token = await res.jwtSign(changeDetails);
    let encryptToken = await encrpytPassword(token);

    res
      .setCookie("cookie_pb_1271", encryptToken, {
        domain: "",
        path: "/",
        secure: true,
        httpOnly: true,
      })
      .send({ result: "success", token: encryptToken });
  } catch (err) {
    throw err;
  }
};
export const getMyDetailsController = async (req, res) => {
  try {
    let a = await cookieChecker(req);
    delete a["password"];
    res.send(cSend(a));
  } catch (err) {
    throw err;
  }
};
export const checkSessionController = async (req, res) => {
  try {
    await cookieChecker(req);
    res.send(req.cookies.cookie_pb_1271);
  } catch (err) {
    throw err;
  }
};
