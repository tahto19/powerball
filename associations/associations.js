import RaffleDetails from "../models/RaffleDetails.model.js";
import RaffleSchedule from "../models/RaffleSchedule.model.js";
import RafflePrize from "../models/RafflePrize.model.js";

const Associations = () => {
  /** RaffleDetails */
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
};

export default Associations;
