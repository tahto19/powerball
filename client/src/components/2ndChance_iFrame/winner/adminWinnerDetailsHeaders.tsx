//@ts-nocheck

import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import moment from "moment";
import { Button, Chip, IconButton } from "@mui/material";
import { Image } from "@mui/icons-material";
import { formatToPesos } from "@/utils/util";
const adminWinnerDetailsHeaders = (
  onClickData?: (row: any) => void
): GridColDef[] => [
  {
    field: "$ticket_detail.User.fullname$",
    headerName: "Name",
    flex: 1,
    minWidth: 200,
  },
  {
    field: "$ticket_detail.User.mobileNumber$",
    headerName: "Contact Number",
    flex: 1,
    minWidth: 200,
  },
  {
    field: "$ticket_detail.User.emailAddress$",
    headerName: "Email Address",
    flex: 1,
    minWidth: 200,
  },
  {
    field: "$ticket_history.ticket_history_generate$",
    headerName: "Raffle Ticket",
    flex: 1,
    minWidth: 200,
  },
  {
    field: "$ticket_detail.ticket_code$",
    headerName: "Ticket Number",
    flex: 1,
    minWidth: 200,
  },
  {
    field: "$ticket_detail.VIN$",
    headerName: "VIRN",
    flex: 1,
    minWidth: 200,
  },
  {
    field: "$Raffle_Prize.amount$",
    headerName: "Amount",
    flex: 1,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams<any, Date>) => {
      return (
        <Chip
          sx={{
            fontFamily: ' "Outfit Variable", sans-serif !important',
            textTransform: "capitalize",
          }}
          label={formatToPesos(params.value)}
          color="success"
        />
      );
    },
  },
  {
    field: "createdAt",
    headerName: "Date Won",
    flex: 1,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams<any, Date>) => {
      return (
        <Chip
          sx={{
            fontFamily: ' "Outfit Variable", sans-serif !important',
            textTransform: "capitalize",
          }}
          label={moment(params.value).format("MMMM dd yyyy, hh:mm a")}
          color="warning"
        />
      );
    },
  },
  {
    field: "action",
    headerName: "action",
    flex: 1,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams<any, Date>) => {
      return (
        <IconButton
          aria-label="upload"
          size="small"
          color="success"
          onClick={() => {
            if (onClickData) onClickData(params.row);
          }}
        >
          <Image />
        </IconButton>
      );
    },
  },
];
export default adminWinnerDetailsHeaders;
