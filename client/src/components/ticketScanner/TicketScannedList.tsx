//@ts-nocheck
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getTicket } from "@/redux/reducers/ticket/asyncCalls";
import { RootState } from "@/redux/store";
import { getDataV2, paginationType } from "@/types/allTypes";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import moment from "moment";
import { useEffect, useState } from "react";
import CustomizedDataGridBasic from "../CustomizedDataGridBasic";
import { Box, Typography } from "@mui/material";
const headers: GridColDef[] = [
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
export default function TicketScannedList({
  url,
}: {
  url: undefined | string;
}) {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.token);
  const { getData } = useAppSelector((state) => state.ticket);
  const { loading, filter, offset, limit, sort, list, count } = getData;
  const [pagination, setPagination] = useState<paginationType>({
    page: 0,
    pageSize: 10,
  });
  useEffect(() => {
    if (token !== null)
      dispatch(
        getTicket({
          filter,
          offset: pagination.page,
          limit: pagination.pageSize,
          sort,
          location: url ? url : location?.pathname,
        })
      );
  }, [location, pagination, token]);

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
  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0px 14px 42px 0px rgba(8, 15, 52, 0.06)",
        padding: "30px",
      }}
    >
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
          Ticket Scanned
        </Typography>
      </Box>
      <CustomizedDataGridBasic
        headers={headers}
        data={list}
        count={count}
        pagination={pagination}
        onTableChange={handleTableChange}
        pageLength={count}
      />
    </Box>
  );
}
