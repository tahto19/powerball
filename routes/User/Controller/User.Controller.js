import { cSend, decryptPassword } from "../../../util/util.js";
import uc from "../lib/User.class.js";

export const getController = async (req, res) => {
  const { limit, offset } = req.query;
  //   if (!limit || !offset) throw new Error("limit or offset is required");
  let a = await uc.FetchOne(offset, limit);
  let b = a.list.toJSON();

  res.send(cSend(a));
};

export const insertController = async (req, res) => {
  if (!req.body) throw new Error("ErrorCODE X2");
  const { firstname, lastname, password, emailAddress, mobileNumber } =
    req.body;
  let a = await uc.Insert({
    firstname,
    lastname,
    password,
    emailAddress,
    mobileNumber,
  });

  res.send(cSend(a));
};
export const updateController = async (req, res) => {
  const { firstname, lastname, password, emailAddress, mobileNumber } =
    req.body;

  let a = await uc.Edit(req.body);
  res.send(cSend(a));
};
export const createUser = async (req, res) => {
  try {
    console.log("here");
  } catch (err) {
    throw err;
  }
};
