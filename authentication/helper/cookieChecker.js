import moment from "moment";

import UserClass from "../../routes/User/lib/User.class.js";
import { decryptPassword } from "../../util/util.js";
export const cookieChecker = async (req) => {
  try {
    const cookie = req.cookies.cookie_pb_1271;
    if (!cookie) throw new Error("Need login!");

    let decryptCookie = await decryptPassword(cookie);
    if (!decryptCookie) throw new Error("ErrorCODE x44");

    let getCookeDetails = await req.jwtVerfiy(decryptCookie);

    if (moment(getCookeDetails.login).diff(moment(), "days") > 0)
      throw new Error("ErroCODE X66");

    if (!getCookeDetails) throw new Error("ErrorCODE x33");

    let userDetails = await UserClass.FetchOne([
      { filter: getCookeDetails.id, type: "string", field: "id" },
      {
        filter: getCookeDetails.emailAddress,
        type: "string",
        field: "emailAddress",
      },
    ]);
    if (userDetails.list === null) throw new Error("ErrorCODE X55");
    return userDetails.list.toJSON();
  } catch (err) {
    console.log("#####################" + err + "################");
    throw err;
  }
};
export default cookieChecker;
