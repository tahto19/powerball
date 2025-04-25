import TicketDetails from "../TicketDetails.model.js";
import TicketHistory from "../TicketHistory.model.js";
import Users from "../Users.model.js";
import RaffleDetails from "../RaffleDetails.model.js";
import RaffleSchedule from "../RaffleSchedule.model.js";
import RafflePrize from "../RafflePrize.model.js";
import Files from "../Files.model.js";
import PrizeList from "../PrizeList.model.js";
import WiningDrawDetails from "../WiningDrawDetails.model.js";

export default function Associations() {
  Users.hasMany(TicketDetails, {
    foreignKey: "user_id",
    targetKey: "id",
    constraints: false,
  });
  TicketDetails.belongsTo(Users, {
    foreignKey: "user_id",
    targetKey: "id",
    constraints: false,
  });
  TicketDetails.hasMany(TicketHistory, {
    foreignKey: "ticket_id",
    targetKey: "id",
    constraints: false,
  });
  TicketHistory.belongsTo(TicketDetails, {
    foreignKey: "ticket_id",
    targetKey: "id",
    constraints: false,
  });
  // connection ng tickethistory at raffle details
  RaffleDetails.hasMany(TicketHistory, {
    foreignKey: "raffle_id",
    targetKey: "id",
    constraints: false,
  });
  TicketHistory.belongsTo(RaffleDetails, {
    foreignKey: "raffle_id",
    targetKey: "id",
    constraints: false,
  });

  RaffleDetails.hasMany(RaffleSchedule, {
    foreignKey: "raffle_id",
    sourceKey: "id",
    as: "raffleSchedule", // Alias for the association
  });

  /** RaffleSchedule */
  RaffleSchedule.belongsTo(RaffleDetails, {
    foreignKey: "raffle_id",
    as: "raffleDetails",
  });
  RaffleSchedule.hasMany(RafflePrize, {
    foreignKey: "raffle_schedule_id",
    sourceKey: "id",
    as: "prizeInfo",
  });

  /** RafflePrize */
  RafflePrize.belongsTo(RaffleSchedule, {
    foreignKey: "raffle_schedule_id",
  });

  RafflePrize.belongsTo(PrizeList, {
    foreignKey: "prize_id",
    targetKey: "id",
    constraints: false,
  });

  RaffleDetails.belongsTo(Files, {
    foreignKey: "file_id",
    sourceKey: "id",
    as: "fileInfo",
  });

  // winningdraw details
  Users.hasMany(WiningDrawDetails, {
    foreignKey: "admin_id",
    targetKey: "id",
  });
  WiningDrawDetails.belongsTo(Users, {
    foreignKey: "admin_id",
    targetKey: "id",
  });
  //
  TicketHistory.hasOne(WiningDrawDetails, {
    foreignKey: "ticket_history_id",
    sourceKey: "id",
  });
  WiningDrawDetails.belongsTo(TicketHistory, {
    foreignKey: "ticket_history_id",
    sourceKey: "id",
  });
  // //
  WiningDrawDetails.belongsTo(TicketDetails, {
    foreignKey: "ticket_id",
    sourceKey: "id",
  });
  TicketDetails.hasOne(WiningDrawDetails, {
    foreignKey: "ticket_id",
    sourceKey: "id",
  });
  //
  WiningDrawDetails.belongsTo(RafflePrize, {
    foreignKey: "raffle_prize_id",
    sourceKey: "id",
  });
  RafflePrize.hasOne(WiningDrawDetails, {
    foreignKey: "raffle_prize_id",
    sourceKey: "id",
  });
}
