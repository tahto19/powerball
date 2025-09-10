import CustomizedDataGrid from "@/components/CustomizedDataGrid";
import { Box, Button, Typography } from "@mui/material";
import { headers } from "./headers";
import { useEffect, useState } from "react";
import { paginationType } from "@/types/allTypes";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { addGetDataFreeT } from "@/redux/reducers/FreeTickets/freeTicketsSlice";
import {
  getDataFreeTicket_,
  postDataFreeTicket_,
} from "@/redux/reducers/FreeTickets/asyncCalls";
import Dialog_ from "./dialog/Dialog_";

export default function FreeEntriesSetup() {
  const { list, count, getData, loading } = useAppSelector(
    (state) => state.freeTickets
  );
  //   const { offset, limit, sort, filter } = getData;
  const [pagination, setPagination] = useState<paginationType>({
    page: 0,
    pageSize: 10,
  });

  const dispatch = useAppDispatch();

  const [dialogOpen, setDialogOpen] = useState<any>({
    open: false,
    data: null,
    type: "hey",
  });

  const handleTableChange = (e: any) => {
    console.log("running");
  };
  useEffect(() => {
    dispatch(getDataFreeTicket_());
  }, []);
  const handleView = (e: any) => {
    setDialogOpen({ open: true, data: e, type: "View" });
  };
  const handleEdit = (e: any) => {
    setDialogOpen({ open: true, data: e, type: "Edit" });
  };
  const onSubmit = (e: any) => {
    dispatch(postDataFreeTicket_(e));
  };
  const closeDialog = () => {
    setDialogOpen({
      open: false,
      data: null,
      type: "",
    });
  };
  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0px 14px 42px 0px rgba(8, 15, 52, 0.06)",
        padding: "30px",
      }}
    >
      <Dialog_
        open={dialogOpen.open}
        action={dialogOpen.type}
        data={dialogOpen.data}
        loading={loading}
        onSubmit={(e) => {
          onSubmit(e);
        }}
        onClose={closeDialog}
      />
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          justifyContent: "space-between",
          mb: "20px",
        }}
      >
        <Typography
          sx={{
            fontSize: "24px",
            fontWeight: "600",
          }}
        >
          List of Free Tickets
        </Typography>

        <Button
          sx={{
            float: "right",
            marginRight: "5px",
          }}
          variant="contained"
          onClick={() => {
            setDialogOpen({
              open: true,
              data: null,
              type: "Add",
            });
          }}
        >
          Add
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          justifyContent: "space-between",
          mb: "20px",
        }}
      ></Box>
      <CustomizedDataGrid
        data={list}
        headers={headers(handleView, handleEdit)}
        pagination={pagination}
        onTableChange={(e: any) => {
          handleTableChange(e);
        }}
        loading={loading}
        pageLength={count ? count : 0}
        isAction={false}
      />
    </Box>
  );
}
