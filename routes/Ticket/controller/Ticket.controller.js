import cookieChecker from "../../../authentication/helper/cookieChecker.js";
import random from "../../../lib/random.js";
import { cSend } from "../../../util/util.js";
import tc from "../lib/Ticket.class.js";
import td from "../../raffleHistory/lib/raffleHistory.class.js";
import wc from "../../winnerEntries/lib/WinnerEntries.class.js";
import axios from "axios";
import alphaCodeClass from "../../AlphaCode/lib/alphaCode.class.js";
import TicketHistory from "../../../models/TicketHistory.model.js";
import Users from "../../../models/Users.model.js";
import WiningDrawDetails from "../../../models/WiningDrawDetails.model.js";
import RaffleSchedule from "../../../models/RaffleSchedule.model.js";
import RaffleDetails from "../../../models/RaffleDetails.model.js";
import rc from "../../GameMaintenance/lib/Raffle.class.js";
import { Op } from "sequelize";
import RafflePrize from "../../../models/RafflePrize.model.js";
import TicketDetails from "../../../models/TicketDetails.model.js";
export const raffleDrawController = async (req, res) => {
  try {
    const { raffle_id, prize_id, winner_id } = req.body;
    if (winner_id) {
      let getWinner = await wc.Fetch(null, [
        {
          field: "id",
          filter: winner_id,
          type: "number",
        },
      ]);
      if (getWinner === 0) throw new Error("ErrorCODE x913");

      await getDeleteWinner.wc({ id: winner_id });
    }

    if (!raffle_id || prize_id === -1 || !prize_id)
      throw new Error("Error X984");
    // check first if the raffle is already done
    let getPrizeScheduleInfo = await RafflePrize.findOne({
      where: { id: prize_id },
    });

    if (!getPrizeScheduleInfo) throw new Error("ErrorCODE X912");
    let getPrizeScheduleInfoToJson = getPrizeScheduleInfo.toJSON();

    // let checkRaffleWinner = await wc.FetchAll({
    //   where: { raffle_prize_id: prize_id },
    // });
    let checkRaffleWinner = await wc.FetchAll(null, [
      {
        field: "raffle_prize_id",
        filter: prize_id,
        type: "number",
      },
    ]);
    let prizeScheduleWinners = getPrizeScheduleInfoToJson.number_of_winners;

    if (checkRaffleWinner.total >= prizeScheduleWinners)
      throw new Error("ErrorCODE X911");

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
export const raffleDrawV2Controller = async (req, res) => {
  try {
    const { raffle_id, prize_id } = req.body;

    if (!raffle_id || prize_id === -1 || !prize_id)
      throw new Error("Error X984");
    // check first if the raffle is already done
    let getPrizeScheduleInfo = await RafflePrize.findOne({
      where: { id: prize_id },
    });
    if (!getPrizeScheduleInfo) throw new Error("ErrorCODE X912");

    let getPrizeScheduleInfoToJson = getPrizeScheduleInfo.toJSON();
    let checkRaffleWinner = await wc.FetchAll(null, [
      {
        field: "raffle_prize_id",
        filter: prize_id,
        type: "number",
      },
    ]);
    let prizeScheduleWinners = getPrizeScheduleInfoToJson.number_of_winners;
    if (checkRaffleWinner.total >= prizeScheduleWinners)
      throw new Error("ErrorCODE X911");

    let getRaffleSchedule = await RaffleSchedule.findOne({
      where: { id: raffle_id },
      include: [
        {
          model: TicketHistory,
          include: [
            { model: WiningDrawDetails },
            { model: TicketDetails, include: [{ model: Users }] },
          ],
        },
      ],
    });

    if (!getRaffleSchedule) throw new Error("ErrorCODE X912");
    let getRaffleScheduletj = getRaffleSchedule.toJSON();

    let firstClear = [];
    let secondClear = [];
    let ticketsThatCanJoin = [];
    let userThatCantJoin = [];
    for (let val of getRaffleScheduletj.ticket_histories) {
      let getWinning = val.wining_draw_detail;

      if (getWinning) userThatCantJoin.push(val.ticket_detail.user_id);
      else {
        firstClear.push({
          ...val,
          ticket_code: val.ticket_history_generate,
          user: val.ticket_detail.user_id,
          user_name: val.ticket_detail.User.fullname,
          raffle_prize_id: val.raffle_id,
          ticket_id: val.ticket_id,
          ticket_history_id: val.id,
        });
      }
    }

    for (let val of firstClear) {
      let checkIfTicketIsHasSameUserId = userThatCantJoin.find(
        (v) => v === val.user
      );
      if (!checkIfTicketIsHasSameUserId) {
        ticketsThatCanJoin.push(val.ticket_code);
        secondClear.push(val);
      }
    }
    if (!ticketsThatCanJoin.length) throw new Error("errorcode x876");
    let a = random(ticketsThatCanJoin);
    let getWinnerTicketDetails = secondClear.find((v) => v.ticket_code === a);

    let b = await wc.Insert({
      admin_id: req.user_id,
      raffle_prize_id: prize_id,
      ticket_history_id: getWinnerTicketDetails.ticket_history_id,
      ticket_id: getWinnerTicketDetails.ticket_id,
    });
    res.send(
      cSend({
        winnerDetails: getWinnerTicketDetails,
        totalEntries: secondClear.length,
      })
    );
  } catch (err) {
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
    let getTicket_ = await tc.FetchAll(
      [["id", "ASC"]],
      [{ field: "VIN", filter: req.body.ticket_id, type: "string_eq" }]
    );

    if (getTicket_.list.length > 0) {
      throw new Error("ErrorCode x314");
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
      throw new Error("ErrorCode x12");
    } else if (
      _r.data.r.trim().toLowerCase() === "this is a winning ticket." ||
      _r.data.r.trim().toLowerCase() === "this is a winning ticket."
    ) {
      throw new Error("ErrorCode x13");
    } else if (
      _r.data.r.trim().toLowerCase() === "error checking ticket." ||
      _r.data.r.trim().toLowerCase() === "error checking ticket"
    ) {
      throw new Error("ErrorCode x12");
    } else if (
      _r.data.r.trim().toLowerCase() === "error checking ticket." ||
      _r.data.r.trim().toLowerCase() === "error checking ticket"
    ) {
      throw new Error("ErrorCode x12");
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
        throw new Error("ErrorCode x314");
      } else {
        let alpha_code = _r.data.t.split("-")[0];
        let getDetailsOfAlphaCode = await alphaCodeClass.FetchOne([
          { field: "name", filter: alpha_code, type: "string" },
        ]);
        if (!getDetailsOfAlphaCode) {
          throw new Error("ErrorCode x351");
        }
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
      console.log(err.response.data);
      // throw new Error(
      //   `Request failed with status ${err.response.status}: ${err.response.data.m}`
      // );
    } else throw err;
  }
};
export const ticketHistoryInEntriesController = async (req, res) => {
  try {
    const { alpha_code } = req.query;
    let filter = [];

    if (alpha_code) {
      filter = [
        {
          field: "alpha_code",
          filter: JSON.parse(alpha_code),
          type: "array-or",
        },
        {
          field: "active",
          filter: true,
          type: "boolean",
        },
      ];
    }

    if (req.url.includes("myEntries")) {
      filter.push({ field: "user_id", filter: req.user_id, type: "number" });
    }

    let r = await tc.getTotalEntries(filter);
    console.log(r.details);
    res.send(cSend(r));
  } catch (err) {
    throw err;
  }
};
export const detailedTicketDetailsHistoryController = async (req, res) => {
  try {
    const { id, limit, sort, offset, filter, location } = req.body;
    var addFilter;

    if (id) {
      addFilter = { field: "id", filter: id, type: "number" };
      filter.push(addFilter);
    }
    if (req.url.includes("myTicketDetails")) {
      filter.push({ field: "user_id", filter: req.user_id, type: "number" });
    }
    filter.push({ field: "active", filter: true, type: "boolean" });
    const get = await tc.FetchAll_(filter, [
      {
        model: TicketHistory,
        attributes: ["ticket_history_generate", "createdAt"],
        required: false,
        include: [
          { model: WiningDrawDetails },
          {
            model: RaffleSchedule,
            attributes: ["status_text", "schedule_date", "status"],
            include: {
              model: RaffleDetails,
              attributes: [
                "name",
                "active",
                "draw_date",
                "starting_date",
                "end_date",
              ],

              as: "raffleDetails",
            },
          },
        ],
      },
    ]);
    let toReturn = [];
    for (let v of get.list) {
      let temp = {
        id: v.id,
        active: v.active,
        alphaCode: v.alpha_code,
        availableEntries: v.entries - v.entries_used,
        totalEntries: v.entries,
        entries_used: v.entries_used,
        ticket_history: v.ticket_histories.map((vv) => {
          return {
            ticket_code: vv.ticket_history_generate,
            joined: vv.createdAt,
            // raffleDrawed:vv.Raff
            win: !!vv.wining_draw_detail,
            schedule_date: vv.Raffle_Schedule.schedule_date,
            draw_date: vv.Raffle_Schedule.raffleDetails.draw_date,
            end_date: vv.Raffle_Schedule.raffleDetails.end_date,
            raffleName: vv.Raffle_Schedule.raffleDetails.name,
            active: vv.Raffle_Schedule.status_text,
          };
        }),
        // ticket_history: v.ticket_histories,
      };

      let raffles = await rc.fetchAllOnlyCostumeFilter({
        alpha_code: { [Op.like]: `%${v.alpha_code}%` },
        end_date: { [Op.gte]: new Date() },
      });

      toReturn.push({ ...temp, raffles });
    }

    res.send(toReturn);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
