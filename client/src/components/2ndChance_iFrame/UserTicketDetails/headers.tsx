//@ts-nocheck
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import * as React from "react";
import moment from "moment";
import { Button, Chip } from "@mui/material";
const headers: GridColDef[] = [
  {
    field: "ticket_history_generate",
    headerName: "Ticket Number",
    flex: 1,
    minWidth: 200,
    editable: true,
  },
  {
    field: "$Raffle_Schedule.raffleDetails.name$",
    headerName: "Participated Raffle",
    flex: 1,
    minWidth: 200,
    editable: true,
  },
  {
    field: "createdAt",
    headerName: "Date Entered",
    flex: 1,
    minWidth: 200,
    editable: true,
    renderCell: (params: GridRenderCellParams<any, Date>) => {
      return `${moment(params.value).format("MMMM DD, yyyy")}`;
    },
  },
  {
    field: "$Raffle_Schedule.schedule_date$",
    headerName: "Draw Date",
    flex: 1,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams<any, Date>) => {
      return `${moment(params.value).format("MMMM DD, yyyy")}`;
    },
  },
  {
    field: "date_time",
    headerName: "Draw Time",
    flex: 1,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams<any, Date>) => {
      return `${moment(params.value).format("hh:mm A")}`;
    },
  },

  {
    field: "$Raffle_Schedule.status_text$",
    headerName: "status",
    flex: 1,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams<any>) => {
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
export default headers;
