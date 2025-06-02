import { emailSender } from "../../../util/util.js";

export const EmailController = async (req, res) => {
  try {
    const { data } = req.body;
    let a = await emailSender(data);

    res.send(a);
  } catch (err) {
    throw err;
  }
};
