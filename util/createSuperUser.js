import AlphaCode from "../models/AlphaCode.js";
import Users from "../models/Users.model.js";
import utc from "../routes/UserType/lib/UserType.class.js";
import { encrpytPassword } from "./util.js";
export const createSuperUser = async () => {
  try {
    console.log("checking if admin already exists");
    const getIfAdminExists = await Users.findOne({
      where: {
        isAdmin: true,
        emailAddress: encrpytPassword(process.env.ADMIN_EMAIL),
      },
    });

    // create admin if not exists
    if (!getIfAdminExists) {
      console.log("creating super user account");
      let userCreation = await Users.create({
        isAdmin: true,
        firstname: "SUPER",
        lastname: "SUPER",
        mobileNumber: "SUPER_USER_1234!",
        emailAddress: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      });
      console.log("done creating super user account");
      let a = await utc.createSuperUser(userCreation.id);

      await Users.update(
        { userType: a.id },
        { where: { id: userCreation.id } }
      );
      //   console.log(a.id);
    } else {
      console.log("updating usertype: " + getIfAdminExists.id);
      await utc.updateSuperUser(getIfAdminExists.id);
      console.log("done updating usertype");
    }
    console.log("check if free alpha code is already created");
    let r = await AlphaCode.findOne({ where: { name: "FREE" } });

    if (!r) {
      await AlphaCode.create({
        name: "FREE",
        active: true,
        entries: 1,
        label: "FREE",
      });
    }
  } catch (err) {
    throw err;
  }
};
