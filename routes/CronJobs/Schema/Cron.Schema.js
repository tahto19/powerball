import {
  dailyRaffleController,
  checkActiveRaffles,
} from "../Controller/Cron.Controller.js";
export const dailyRaffleSchema = {
  handler: dailyRaffleController,
};

export const checkActiveRafflesSchema = {
  handler: checkActiveRaffles,
};
