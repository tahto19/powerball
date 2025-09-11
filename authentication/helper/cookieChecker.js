import moment from "moment";

import UserClass from "../../routes/User/lib/User.class.js";
import { decryptPassword, encrpytPassword } from "../../util/util.js";
import fastifyJwt from "@fastify/jwt";
export const cookieChecker = async (req) => {
  try {
    const cookie = req?.cookies?.cookie_pb_1271;
    if (!cookie) {
      const err = new Error("Need login!");
      err.status = 401;
      throw err;
    }
    let decryptCookie = await decryptPassword(cookie);
    if (!decryptCookie) throw new Error("ErrorCODE x44");

    let getCookeDetails = await req.jwtVerfiy(decryptCookie);

    if (moment(getCookeDetails.login).diff(moment(), "days") > 0)
      throw new Error("ErrorCODE X66");

    if (!getCookeDetails) throw new Error("ErrorCODE x33");

    let userDetails = await UserClass.FetchOneV2([
      { filter: getCookeDetails.id, type: "number", field: "id" },
      {
        filter: getCookeDetails.mobileNumber,
        type: "string",
        field: "mobileNumber",
      },
    ]);

    if (userDetails === null) throw new Error("ErrorCODE X55");
    return userDetails.toJSON();
  } catch (err) {
    throw err;
  }
};

export default cookieChecker;
