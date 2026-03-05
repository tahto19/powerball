import axiosClient from "../../../util/axiosClient";
import "dotenv/config";

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
    throw err;
  }
};
