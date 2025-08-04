//@ts-nocheck

import { Grid2, Typography, Button, IconButton } from "@mui/material";
import React, { useEffect } from "react";
import CustomizedDataGrid from "../CustomizedDataGrid";
// import headers from "./headers.ts";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getAdmin, getCostumer } from "@/redux/reducers/user/asnycCalls";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import MyDialog from "./MyDialog";
import { DataProps, getDataV2 } from "@/types/allTypes";
import axios from "axios";
import { downloadData } from "@/redux/reducers/download/asyncCalls";
import { openDialog } from "@/redux/reducers/download/exportDataSlice";
import { AdminPanelSettings } from "@mui/icons-material";
import AdminDialogConfirmation from "./AdminDialogConfirmation";
import { RootState } from "@/redux/store";
const Costumer = () => {
  const dispatch = useAppDispatch();
  const { loading, list, offset, limit, sort, count } = useAppSelector(
    (state: RootState) => state.costumer
  );

  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [open, setOpen] = useState(false);
  const [openConfimation, setConfirmation] = useState(true);
  const [userToAdmin, setUserToAdmin] = useState({});
  const [data, setData] = useState([]);
  const [dialogType, setDialogType] = useState(null);
  const onClose = () => {
    setOpen(false);
    setDialogType(null);
    setData([]);
  };
  useEffect(() => {
    dispatch(getCostumer());
  }, []);
  useEffect(() => {
    setPagination((prev) => {
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
    };
    dispatch(getCostumer(query));
  };
  const handleEditAction = (row: DataProps) => {
    setDialogType("Edit");
    setData(row);
    setOpen(true);
  };
  const handleViewAction = (row: PrizeState) => {
    setDialogType("View");
    setData(row);
    setOpen(true);
  };
  const handleDownload = async () => {
    try {
      dispatch(downloadData({ type: 6 }));
    } catch (err) {
      console.log(err);
    }
  };
  const handleAdminUser = async (e) => {
    setConfirmation(true);
    setUserToAdmin(e);
  };
  const handleCloseDialog = () => {
    setConfirmation(false);
    setUserToAdmin();
  };
  const headers: GridColDef[] = [
    {
      field: "fullname",
      headerName: "Full Name",
      flex: 1,
      minWidth: 200,
      editable: true,
    },
    {
      field: "emailAddress",
      headerName: "Email Address",
      flex: 1,
      minWidth: 200,
      editable: true,
    },
    {
      field: "active",
      headerName: "active",
      flex: 1,
      minWidth: 200,
      renderCell: (params: { value: any }) => {
        return params.value ? (
          <CheckIcon sx={{ color: "green" }} />
        ) : (
          <CloseIcon sx={{ color: "red" }} />
        );
      },
    },
    {
      field: "action",
      headerName: "actions",
      flex: 1,
      minWidth: 200,
      renderCell: (params: { value: any }) => {
        return (
          <IconButton
            onClick={() => handleAdminUser(params.row)}
            color="primary"
          >
            <AdminPanelSettings />
          </IconButton>
        );
      },
    },
  ];

  return (
    <Grid2
      container
      spacing={2}
      columns={12}
    >
      <Grid2
        sx={{ display: "flex", alignItems: "center" }}
        size={{ xs: 6, sm: 6, lg: 6 }}
      >
        <Typography
          component="h2"
          variant="h6"
        >
          Customer
        </Typography>
      </Grid2>
      {/* <Grid2 size={{ xs: 6, sm: 6, lg: 6 }}>
        <Button
          sx={{
            float: "right",
          }}
          variant="contained"
          onClick={() => {
            setOpen(true);
            setDialogType("Add");
          }}
        >
          Add Admin
        </Button>
      </Grid2> */}
      <Grid2
        sx={{ display: "flex", justifyContent: "end" }}
        size={{ xs: 6, sm: 6, lg: 6 }}
      >
        <Button
          onClick={() =>
            dispatch(openDialog({ title: "Tickets List", type: 2 }))
          }
        >
          Export
        </Button>
      </Grid2>
      <Grid2 size={12}>
        <CustomizedDataGrid
          sx={{
            width: "100%",
          }}
          headers={headers}
          data={list}
          pagination={pagination}
          onTableChange={handleTableChange}
          pageLength={count}
          isAction={false}
          // onEditAction={handleEditAction}
          // onViewAction={handleViewAction}
        />
      </Grid2>
      <MyDialog
        open={open}
        onClose={onClose}
        data={data}
        dialogType={dialogType}
      />
      <AdminDialogConfirmation
        open={openConfimation}
        details={userToAdmin}
        closeDialog={handleCloseDialog}
      />
    </Grid2>
  );
};

export default Costumer;
