import axiosClient from "../../../util/axiosClient.js";
import "dotenv/config";
import { eScratchErrorStatus, cSend } from "../../../util/util.js";
import ec from "../lib/EScratch.class.js";
export const EScratchController = async (req, res) => {
  try {
    const { credits } = req.body;

    if (credits && Number(credits)) {
      const toGems = credits * 20;
      let mobileNumber = "";
      const user = await ec.FetchOne([
        { field: "id", filter: req.user_id, type: "number" },
      ]);

      if (user?.dataValues?.mobileNumber) {
        mobileNumber = user.dataValues.mobileNumber;
      } else {
        throw new Error("ErrorCODE x811");
      }

      const url = process.env.ESCRATCH_BASE_URL;
      const default_headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ESCRATCH_TOKEN}`, // default auth header
      };
      const r = await axiosClient.post(
        url + "/vendor/api/credits-sso",
        { mobile: mobileNumber, credits: Number(toGems) },
        {
          headers: default_headers,
        },
      );

      res.send(cSend(r));
    } else {
      throw new Error("ErrorCODE x810");
    }
  } catch (err) {
    if (err?.response?.data?.m) {
      const m = eScratchErrorStatus(err?.response?.data?.m);
      throw new Error(m.toString());
    } else {
      throw err;
    }
  }
};
