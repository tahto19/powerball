import axiosClient from "../../../util/axiosClient.js";
import "dotenv/config";
import { eScratchErrorStatus, cSend } from "../../../util/util.js";

export const EScratchController = async (req, res) => {
  try {
    const { mobile, credits } = req.body;

    const url = process.env.ESCRATCH_BASE_URL;
    const default_headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ESCRATCH_TOKEN}`, // default auth header
    };
    const res = await axiosClient.post(
      url + "/vendor/api/credits-sso",
      { mobile, credits: Number(credits) },
      {
        headers: default_headers,
      },
    );

    res.send(cSend(res));
  } catch (err) {
    if (err?.response?.data?.m) {
      const m = eScratchErrorStatus(err?.response?.data?.m);
      throw new Error(m.toString());
    } else {
      throw err;
    }
  }
};
