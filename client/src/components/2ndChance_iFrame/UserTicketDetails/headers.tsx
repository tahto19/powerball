//@ts-nocheck
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import * as React from "react";
import moment from "moment";
import { Avatar, Button, Chip } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { motion } from "framer-motion";
const BouncingIcon = motion(EmojiEventsIcon);
const headers: GridColDef[] = [
  {
    field: "$ticket_detail.ticket_code$",
    headerName: "Raffle Ticket",
    flex: 1,
    minWidth: 200,
    editable: true,
  },
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
      if (params.value.toLowerCase() !== "winner")
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
      else
        return (
          <motion.div whileHover={{ scale: 1.1 }}>
            <Chip
              icon={
                <BouncingIcon
                  animate={{
                    y: [1, -5, 0], // bounce up and down
                  }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                />
              }
              label="Winner"
              color="warning"
            />
          </motion.div>
        );
    },
  },
];
export default headers;
