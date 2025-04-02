import { GridColDef } from "@mui/x-data-grid";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import React from "react";
const headers: GridColDef[] = [
  {
    "field": "fullname",
    "headerName": "Full Name",
    "flex": 1,
    "minWidth": 200,
    "editable": true,
  },
  {
    "field": "emailAddress",
    "headerName": "Email Address",
    "flex": 1,
    "minWidth": 200,
    "editable": true,
  },
  {
    "field": "active", 
    "headerName": 
    "active", 
    "flex": 1, 
    "minWidth": 200,
    renderCell: (params: { value: any }) => {
      return params.value ? `${<CheckIcon /> }`: <CloseIcon />;
    },
  }
]
export default headers