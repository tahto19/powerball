import { cSend, decryptPassword, encrpytPassword } from "../../../util/util.js";
import prc from "../lib/PasswordResets.Class.js";
import moment from "moment";
import uc from "../../User/lib/User.class.js";
export const forgotPassword = async (req, res) => {
  if (!req.body) throw new Error("ErrorCODE X2");

  const { email } = req.body;

  let filter = [{ field: "emailAddress", filter: email, type: "string" }];
  let user = await prc.FindUser(filter);
  if (!user) throw new Error("ErrorCODE x75");

  //avoid using previous token when creating a new token.
  let updateBulk = await prc.EditBulk({ used: true }, { user_id: user.id });
  console.log(updateBulk);

  const expires_at = moment().add(15, "minutes").format("YYYY-MM-DD HH:mm:ss");
  let data = {
    user_id: user.id,
    expires_at,
  };

  let create = await prc.Insert(data);
  const token_details = {
    id: create.id,
  };

  let token = await res.jwtSign(token_details);
  let encryptToken = await encrpytPassword(token);
  data = {
    id: create.id,
    token: encryptToken,
  };

  let update = await prc.Edit(data);
  const emailSender = await update.emailPasswordResetLink();

  if (!emailSender) throw new Error("ErrorCODE X741");

  res.send(cSend("SENT"));
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!password || password.trim() === "") throw new Error("ErrorCODE x764");

  let decrypt = await decryptPassword(token);
  if (!decrypt) throw new Error("ErrorCODE x761");

  let getTokenDetails = await req.jwtVerfiy(decrypt);
  if (!getTokenDetails) throw new Error("ErrorCODE x33");

  let filter = [{ field: "id", filter: getTokenDetails.id, type: "number" }];
  let resetDetails = await prc.Find(filter);

  if (resetDetails.used) throw new Error("ErrorCODE x763");

  if (moment().isAfter(resetDetails.expires_at))
    throw new Error("ErrorCODE x763");

  const _data = {
    id: resetDetails.user_id,
    password: password,
  };
  const _data2 = {
    id: getTokenDetails.id,
    used: true,
  };

  await uc.Edit(_data); //update user password
  await prc.Edit(_data2); // update token to "used"

  res.send(cSend("UPDATED"));
};
