import moment from "moment";

import UserClass from "../../routes/User/lib/User.class.js";
import { decryptPassword, encrpytPassword } from "../../util/util.js";
import fastifyJwt from "@fastify/jwt";
export const cookieChecker = async (req) => {
  try {
    const cookie = req?.cookies?.cookie_pb_1271;
    if (!cookie) throw new Error("Need login!");

    let decryptCookie = await decryptPassword(cookie);
    if (!decryptCookie) throw new Error("ErrorCODE x44");

    let getCookeDetails = await req.jwtVerfiy(decryptCookie);

    if (moment(getCookeDetails.login).diff(moment(), "days") > 0)
      throw new Error("ErrorCODE X66");

    if (!getCookeDetails) throw new Error("ErrorCODE x33");

    let userDetails = await UserClass.FetchOne([
      { filter: getCookeDetails.id, type: "number", field: "id" },
      {
        filter: encrpytPassword(getCookeDetails.emailAddress),
        type: "string",
        field: "emailAddress",
      },
    ]);

    if (userDetails === null) throw new Error("ErrorCODE X55");
    return userDetails.toJSON();
  } catch (err) {
    throw err;
  }
};

export default cookieChecker;
