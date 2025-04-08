import { raffleDrawSchema } from "./schema/Ticket.Schema.js";

const Ticket = (app, opts, done) => {
  app.post("/draw", raffleDrawSchema);
  done();
};
export default Ticket;
