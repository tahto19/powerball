import cookieChecker from "../../../authentication/helper/cookieChecker.js";
import random from "../../../lib/random.js";
import { cSend } from "../../../util/util.js";
import tc from "../lib/Ticket.class.js";
import td from "../../raffleHistory/lib/raffleHistory.class.js";
import wc from "../../winnerEntries/lib/WinnerEntries.class.js";
import axios from "axios";
export const raffleDrawController = async (req, res) => {
  try {
    const { raffle_id, prize_id } = req.body;
    if (!raffle_id || prize_id === -1 || !prize_id)
      throw new Error("Error X984");
    // check first if the raffle is already done
    let checkRaffleWinner = await wc.FetchOne({
      where: { raffle_prize_id: prize_id },
    });

    if (checkRaffleWinner.count > 0) throw new Error("ErrorCODE X911");

    const getTicketsWithRaffleId = await td.fetchTicketsInRaffle(raffle_id);

    let getTicketNumber = getTicketsWithRaffleId.list.map(
      (v) => v.ticket_history_generate
    );

    // draw raffle here
    let a = random(getTicketNumber);
    let getWinnerTicketDetails = getTicketsWithRaffleId.list.find(
      (v) => v.ticket_history_generate === a
    );
    // insert the winner prize ticket entry
    let b = await wc.Insert({
      admin_id: req.user_id,
      raffle_prize_id: prize_id,
      ticket_history_id: getWinnerTicketDetails.id,
      ticket_id: getWinnerTicketDetails.ticket_id,
    });

    res.send(
      cSend({
        winnerDetails: getWinnerTicketDetails,
        totalEntries: getTicketsWithRaffleId.count,
      })
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const fetchTicketController = async (req, res) => {
  try {
    const { limit, sort, offset, filter, location } = req.body;
    let filter_ = filter ? filter : [];
    if (location && location.includes("myScan")) {
      filter_.push({ field: "user_id", filter: req.user_id, type: "number" });
    }

    let r = await tc.Fetch(offset, limit, sort, filter_);

    res.send(r);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const postTicketController = async (req, res) => {
  try {
    let _r = await axios.post(
      process.env.TICKET_VALIDATION_API,
      {},
      {
        params: { t: req.body.ticket_id },
        headers: {
          authorization: `Bearer ${process.env.TICKET_VALIDATION_TOKEN}`,
        },
      }
    );
    console.log("qrcode is: ", req.body.ticket_id);
    if (
      _r.data.r.trim() === "This is a non-winning ticket." ||
      _r.data.r.trim() === "Error checking ticket."
    ) {
      throw new Error(_r.data.r);
    }
    // let _r = { data: { a: 3 } };
    let r = await tc.Insert({
      ticket_info: { ticket_id: req.body.ticket_id },
      entries: _r.data.a,
      user_id: req.user_id,
    });
    res.send({
      message: `You've entered a ticket with ${_r.data.a} entries.`,
      result: "success",
    });
  } catch (err) {
    if (err.response) {
      throw new Error(
        `Request failed with status ${err.response.status}: ${err.response.data.m}`
      );
    } else throw err;
  }
};
export const ticketHistoryInEntriesController = async (req, res) => {
  try {
    const { alpha_code } = req.query;
    let filter = [];

    if (alpha_code) {
      filter = [{ field: "alpha_code", filter: alpha_code, type: "string_eq" }];
    }

    if (req.url.includes("myEntries")) {
      filter.push({ field: "user_id", filter: req.user_id, type: "number" });
    }

    let r = await tc.getTotalEntries(filter);

    res.send(cSend(r));
  } catch (err) {
    throw err;
  }
};
