//@ts-nocheck

import { useEffect, useState } from "react";
import Dialog_ from "./Dialog_";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getTicket } from "@/redux/reducers/ticket/asyncCalls";
import { RootState } from "@/redux/store";
import { Button, Grid2, Typography } from "@mui/material";
import CustomizedDataGridBasic from "../CustomizedDataGridBasic";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  getDataV2,
  getTicketState,
  LocationState,
  paginationType,
} from "@/types/allTypes";
import moment from "moment";
import { useLocation } from "react-router-dom";
import RandomString from "@/animated/RandomLetters";
const headers: GridColDef[] = [
  {
    field: "fullname",
    headerName: "Full Name",
    flex: 1,
    minWidth: 200,
    editable: true,
    renderCell: (params: GridRenderCellParams<any, Date>) => {
      return <>{moment(params.value).format("MMMM DD yyyy hh:mm A")}</>;
    },
  },
  {
    field: "entries",
    headerName: "Entries",
    flex: 1,
    minWidth: 200,
    editable: true,
  },
  {
    field: "entries_used",
    headerName: "Entries Used",
    flex: 1,
    minWidth: 200,
    editable: true,
  },
  {
    field: "createdAt",
    headerName: "Created",
    flex: 1,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams<any, Date>) => {
      return <>{moment(params.value).format("MMMM DD yyyy hh:mm A")}</>;
    },
  },
];
const TicketScanner = () => {
  const dispatch = useAppDispatch();
  const { getData } = useAppSelector((state: RootState) => state.ticket);
  const { loading, filter, offset, limit, sort, list, count } = getData;
  const [pagination, setPagination] = useState<paginationType>({
    page: 0,
    pageSize: 10,
  });
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<getTicketState>({
    ticket_info: null,
    entries: null,
    entries_used: null,
    createdAt: null,
  });
  const [dialogType, setDialogType] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    dispatch(
      getTicket({
        filter,
        offset: pagination.page,
        limit: pagination.pageSize,
        sort,
        location: location?.pathname,
      })
    );
  }, [location, pagination]);
  useEffect(() => {
    setPagination(() => {
      return { page: offset, pageSize: limit };
    });
  }, [loading]);
  const handleTableChange = async ({
    page,
    pageSize,
    sortModel,
    filterModel,
  }: any) => {
    console.log("Table Changed:", { page, pageSize, sortModel, filterModel });

    setPagination({ page, pageSize });

    const sort = [["id", "DESC"]];
    if (sortModel.length > 0) {
      sort.push([sortModel[0].field, sortModel[0].sort.toUpperCase()]);
    }

    let newFilterModel = [];

    if (filterModel.items.length > 0) {
      newFilterModel = JSON.parse(JSON.stringify(filterModel)).items.map(
        (x: any) => {
          x.filter = x.value;
          x.type = "string";

          delete x.value;
          delete x.fromInput;
          delete x.id;
          delete x.operator;
          return x;
        }
      );
    }

    const query: getDataV2 = {
      offset: page,
      limit: pageSize,
      sort: sort,
      filter: newFilterModel,
      location: undefined,
    };
    console.log(query);
    // const res = await apiService.getPrizeList(query);
  };

  const handleEditAction = (row: getTicketState) => {
    setDialogType("Edit");
    setData(row);
    setOpen(true);
  };
  const handleViewAction = (row: getTicketState) => {
    setDialogType("View");
    setData(row);
    setOpen(true);
  };
  const onClose = () => {
    setData({
      ticket_info: null,
      entries: null,
      entries_used: null,
      createdAt: null,
    });
    setOpen(!open);
  };
  return (
    <Grid2
      container
      spacing={2}
    >
      <Dialog_
        onClose={onClose}
        open={open}
        dialogType={dialogType}
        data={data}
      ></Dialog_>
      <Grid2
        sx={{ display: "flex", alignItems: "center" }}
        size={{ xs: 6, sm: 6, lg: 6 }}
      >
        <Typography
          component="h2"
          variant="h6"
        >
          {location.pathname.includes("myScan") ? "My" : "All"} Ticket Details
        </Typography>
      </Grid2>
      <Grid2 size={{ xs: 6, sm: 6, lg: 6 }}>
        {/* <Button
          sx={{
            float: "right",
          }}
          variant="contained"
          onClick={() => {
            setOpen(true);
            setDialogType("Add");
          }}
        >
          Scan
        </Button> */}
      </Grid2>
      <Grid2 size={12}>
        <CustomizedDataGridBasic
          sx={{
            width: "100%",
          }}
          headers={headers}
          data={list}
          pagination={pagination}
          onTableChange={handleTableChange}
          pageLength={count}
          onEditAction={handleEditAction}
          onViewAction={handleViewAction}
        />
      </Grid2>
      {/* <Dialog_></Dialog_> */}
    </Grid2>
  );
};

export default TicketScanner;
