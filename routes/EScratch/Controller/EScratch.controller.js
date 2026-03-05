import axiosClient from "../../../util/axiosClient.js";
import "dotenv/config";
import { eScratchErrorStatus } from "../../../util/util.js";

export const EScratchController = async (req, res) => {
  try {
    const { mobile, credits } = req.body;
    console.log("================", mobile);
    console.log("================", credits);

    const url = process.env.ESCRATCH_BASE_URL;
    const default_headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ESCRATCH_TOKEN}`, // default auth header
    };
    const res = await axiosClient.post(
      url + "/vendor/api/credits-sso",
      { mobile, credits },
      {
        headers: default_headers,
      },
    );

    res.send(cSend(a));
  } catch (err) {
    if (err?.response?.data?.m) {
      const m = eScratchErrorStatus(err?.response?.data?.m);
      throw new Error(m.toString());
    } else {
      throw err;
    }
  }
};
