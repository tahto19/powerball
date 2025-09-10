import CustomizedDataGrid from "@/components/CustomizedDataGrid";
import { Box, Button, Typography } from "@mui/material";
import { headers } from "./headers";
import { useEffect, useState } from "react";
import { getDataV2, paginationType } from "@/types/allTypes";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  getDataFreeTicket_,
  postDataFreeTicket_,
} from "@/redux/reducers/FreeTickets/asyncCalls";
import Dialog_ from "./dialog/Dialog_";

export default function FreeEntriesSetup() {
  const { list, count, getData, loading } = useAppSelector(
    (state) => state.freeTickets
  );
  const { offset, limit } = getData;
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
    dispatch(getDataFreeTicket_(query));
  };
  useEffect(() => {
    dispatch(getDataFreeTicket_());
    setPagination(() => {
      return { page: offset, pageSize: limit };
    });
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
