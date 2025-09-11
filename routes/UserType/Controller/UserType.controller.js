import uc from "../../User/lib/User.class.js";
import utc from "../lib/UserType.class.js";
export const getUserTypeByUserController = async (req, res) => {
  try {
    const { id } = req.query;

    const r_ = await uc.FetchOneV2([
      {
        field: "id",
        filter: parseInt(id),
        type: "number",
      },
    ]);
    if (!r_) throw new Error("ErrorCode x910");
    let r_toJson = r_.toJSON();

    if (!r_.isAdmin) {
      throw new Error("ErrorCode x933");
    }

    if (!r_toJson.myUserType) {
      let b = await utc.createUserType(id);
      r_toJson["myUserType"] = b;
      await uc.Edit({ id, userType: b.id });
    }
    res.send(r_toJson);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const patchDataController = async (req, res) => {
  try {
    // console.log(req.body);
    const { id, permissions } = req.body;
    let r_ = await utc.updateUserType({ id, permissions });

    res.send({ result: "success", id });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getUserTypeController = async (req, res) => {
  const { id } = req.body;
};
