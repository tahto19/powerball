import cookieChecker from "../../../authentication/helper/cookieChecker.js";
import random from "../../../lib/random.js";
import { cSend } from "../../../util/util.js";
import tc from "../lib/Ticket.class.js";
import td from "../../raffleHistory/lib/raffleHistory.class.js";
import wc from "../../winnerEntries/lib/WinnerEntries.class.js";
import axios from "axios";
import alphaCodeClass from "../../AlphaCode/lib/alphaCode.class.js";
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
    console.log(sort);
    let r = await tc.Fetch(offset, limit, sort, filter_);

    res.send(r);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const postTicketController = async (req, res) => {
  try {
    let getTicket_ = await tc.FetchAll(
      [["id", "ASC"]],
      [{ field: "VIN", filter: req.body.ticket_id, type: "string_eq" }]
    );
    if (getTicket_.list.length > 0) {
      throw new Error("This ticket has already been entered into the raffle");
    }
    let _r = await axios.post(
      process.env.TICKET_VALIDATION_API,
      {},
      {
        params: { t: req.body.ticket_id },
        // params: { t: 1962993600019698859342 },
        headers: {
          authorization: `Bearer ${process.env.TICKET_VALIDATION_TOKEN}`,
        },
      }
    );

    // _r.data.r.trim() === "This is a non-winning ticket." ||
    if (_r.data.r.trim() === "Error checking ticket.") {
      throw new Error(_r.data.r);
    } else if (_r.data.r.trim().toLowerCase() === "this is a winning ticket") {
      throw new Error(
        "This is a winning ticket and is not eligible for raffle draw"
      );
    } else if (_r.data.r.trim().toLowerCase() === "error checking ticket") {
      throw new Error(
        "Scan Error. Please call (0917) 188 5885 or (0919) 099 1999 for assistance"
      );
    } else if (_r.data.r.trim().toLowerCase() === "error checking ticket") {
      throw new Error(
        "This is a winning ticket and is not eligible for the raffle draw."
      );
    }
    if (_r.data.t) {
      // check if the ticket is exists
      let getTicket = await tc.FetchAll(
        [["id", "ASC"]],
        [
          { field: "ticket_code", filter: _r.data.t, type: "string_eq" },
          { field: "VIN", filter: req.body.ticket_id, type: "string_eq" },
        ]
      );

      if (getTicket.list.length > 0) {
        throw new Error("This ticket has already been entered into the raffle");
      } else {
        let alpha_code = _r.data.t.split("-")[0];
        let getDetailsOfAlphaCode = await alphaCodeClass.FetchOne([
          { field: "name", filter: alpha_code, type: "string" },
        ]);
        if (!getDetailsOfAlphaCode) throw new Error("ErrorCode x351");
        let r = await tc.Insert({
          ticket_info: _r.data,
          VIN: req.body.ticket_id,
          entries: getDetailsOfAlphaCode.entries,
          user_id: req.user_id,
          alpha_code: alpha_code,
          ticket_code: _r.data.t,
        });
        res.send({
          message: `Congratulations, your ticket has been successfully registered!`,
          result: "success",
        });
      }
    }
    // let _r = { data: { a: 3 } };
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
      console.log(JSON.parse(alpha_code));
      filter = [
        {
          field: "alpha_code",
          filter: JSON.parse(alpha_code),
          type: "array-or",
        },
      ];
    }

    if (req.url.includes("myEntries")) {
      filter.push({ field: "user_id", filter: req.user_id, type: "number" });
    }
    console.log(filter);
    let r = await tc.getTotalEntries(filter);

    res.send(cSend(r));
  } catch (err) {
    throw err;
  }
};
