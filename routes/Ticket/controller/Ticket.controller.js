import cookieChecker from "../../../authentication/helper/cookieChecker.js";
import random from "../../../lib/random.js";
import { cSend } from "../../../util/util.js";
import tc from "../lib/Ticket.class.js";
import td from "../../raffleHistory/lib/raffleHistory.class.js";
import wc from "../../winnerEntries/lib/WinnerEntries.class.js";
export const raffleDrawController = async (req, res) => {
  try {
    const { raffle_id, prize_id } = req.body;
    if (!raffle_id || prize_id === -1 || !prize_id)
      throw new Error("Error X984");
    // check first if the raffle is already done
    let checkRaffleWinner = await wc.FetchOne({
      where: { raffle_prize_id: prize_id },
    });

    console.log(prize_id);
    console.log(raffle_id);

    console.log(checkRaffleWinner);
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
    console.log({
      winnerDetails: getWinnerTicketDetails,
      totalEtnries: getTicketsWithRaffleId.count,
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
    let r = await tc.Insert({
      ticket_info: { ticket_id: req.body.ticket_id },
      entries: 2,
      user_id: req.user_id,
    });
    res.send({ message: "success", data: r });
  } catch (err) {
    throw err;
  }
};
export const ticketHistoryInEntriesController = async (req, res) => {
  try {
    let filter = [];
    if (req.url.includes("myEntries")) {
      filter.push({ field: "user_id", filter: req.user_id, type: "number" });
    }

    let r = await tc.getTotalEntries(filter);

    res.send(cSend(r));
  } catch (err) {
    throw err;
  }
};
