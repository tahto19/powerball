//@ts-nocheck

import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import moment from "moment";
import { Button, Chip } from "@mui/material";
const WinnerDetailsHeaders: GridColDef[] = [
  {
    field: "$ticket_history.ticket_history_generate$",
    headerName: "Winning Ticket",
    flex: 1,
    minWidth: 200,
  },
  {
    field: "$Raffle_Prize.createdAt$",
    headerName: "Draw Date",
    flex: 1,
    minWidth: 200,

    renderCell: (params: GridRenderCellParams<any, Date>) => {
      return `${moment(params.value).format("MMMM DD, yyyy hh:mm:ss A")}`;
    },
  },
  {
    field: "$Raffle_Prize.Raffle_Schedule.raffleDetails.name$",
    headerName: "Raffle Joined",
    flex: 1,
    minWidth: 200,
  },
  {
    field: "Status",
    headerName: "Status",
    flex: 1,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams<any, Date>) => {
      return (
        <Chip
          sx={{
            fontFamily: ' "Outfit Variable", sans-serif !important',
            textTransform: "capitalize",
          }}
          label={params.value}
          color={params.value === "active" ? "success" : "error"}
        />
      );
    },
  },
];
export default WinnerDetailsHeaders;
