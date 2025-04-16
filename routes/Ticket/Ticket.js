import {
  fetchTicketSchema,
  postTicketSchema,
  raffleDrawSchema,
  ticketHistoryInEntriesSchema,
} from "./schema/Ticket.Schema.js";

const Ticket = (app, opts, done) => {
  app.post("/draw", raffleDrawSchema);
  app.post("/user", fetchTicketSchema);
  app.post("/admin", fetchTicketSchema);
  app.post("/", postTicketSchema);
  app.get("/entries", ticketHistoryInEntriesSchema);
  done();
};
export default Ticket;
