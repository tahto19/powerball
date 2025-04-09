import random from "../../../lib/random.js";
import { cSend } from "../../../util/util.js";

export const raffleDrawController = (req, res) => {
  try {
    const { tickets } = req.body;
    console.log(tickets);
    let a = random(tickets);
    res.send(cSend(a));
  } catch (err) {
    throw err;
  }
};
