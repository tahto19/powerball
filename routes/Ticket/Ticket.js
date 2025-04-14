import {
  fetchTicketSchema,
  postTicketSchema,
  raffleDrawSchema,
} from "./schema/Ticket.Schema.js";

const Ticket = (app, opts, done) => {
  app.post("/draw", raffleDrawSchema);
  app.post("/user", fetchTicketSchema);
  app.post("/admin", fetchTicketSchema);
  app.post("/", postTicketSchema);
  done();
};
export default Ticket;
