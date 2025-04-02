import RaffleDetails from "../../../models/RaffleDetails.model";
import RafflePrize from "../../../models/RafflePrize.model";
import RaffleSchedule from "../../../models/RaffleSchedule.model";

class Raffle_class {
  constructor() {}

  async Insert(_data) {
    const prize_id = _data.prize_id;
    const amount = _data.amount;

    delete _data.prize_id;
    delete _data.amount;

    const createRaffleDetails = await RaffleDetails.create(_data);

    //======== Create Raffle schedule data ===============//
    const scheduleData = {
      raffle_id: createRaffleDetails.id,
      schedule_date: _data.starting_date,
    };
    const createRaffleSchedule = await RaffleSchedule.create(scheduleData);

    //======== Create Raffle prize data ===============//
    const prizeData = {
      raffle_schedule_id: createRaffleSchedule.id,
      prize_id: prize_id,
      amount: amount,
    };
    const createRafflePrizeInfo = await RaffleDetails.create(_data);

    return createRaffleDetails.id;
  }
}
