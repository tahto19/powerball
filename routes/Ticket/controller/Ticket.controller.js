import cookieChecker, {
  getUserByCookie,
} from "../../../authentication/helper/cookieChecker.js";
import random from "../../../lib/random.js";
import { cSend } from "../../../util/util.js";
import tc from "../lib/Ticket.class.js";
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
export const fetchTicketController = async (req, res) => {
  try {
    const { limit, sort, offset, filter } = req.body;
    let r = await tc.Fetch(offset, limit, sort, filter);
    res.send(r);
  } catch (err) {
    throw err;
  }
};
export const postTicketController = async (req, res) => {
  try {
    let r = await tc.Insert({
      ticket_info: { ticket_id: req.body.ticket_id },
      entries: 2,
      user_id: req.user_id,
    });
    res.send({ message: "success" });
  } catch (err) {
    throw err;
  }
};
