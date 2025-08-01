//@ts-nocheck
import CustomizedDataGrid from "@/components/CustomizedDataGrid";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid2,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import headers from "./headers.tsx";
import CustomizedDataGridBasic from "@/components/CustomizedDataGridBasic";
import { SimpleTable } from "@/components/SimpleTable";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  getRaffleEntry,
  getRaffleEntryList,
} from "@/redux/reducers/raffleEntry/asyncCalls";
import { useNavigate } from "react-router-dom";
import { paginationType } from "@/types/allTypes";
import { getTicket } from "@/redux/reducers/ticket/asyncCalls";
import { RootState } from "@/redux/store";
const items = [
  { type: "test", id: 1 },
  { type: "test3", id: 2 },
  { type: "test3", id: 3 },
];
export function MyEntries() {
  const { totalEntries, totalTicket, totalUsedEntries } = useAppSelector(
    (state) => state.raffleEntry
  );
  const { loading, token } = useAppSelector((state) => state.token);
  const { raffleEntriesList } = useAppSelector(
    (state: RootState) => state.raffleEntry
  );
  const { _loading, filter, offset, limit, sort, list, count } =
    raffleEntriesList;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading) {
      if (token === null) {
        navigate("/iframe/2nd-chance/login");
      }
    }
  }, [loading]);

  useEffect(() => {
    if (totalTicket === null && token !== null) {
      // this total ticket entry get
      dispatch(getRaffleEntry({ type: "myEntries" }));
    }
  }, [totalTicket, token]);

  const [pagination, setPagination] = useState<paginationType>({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    if (token) {
      dispatch(
        getRaffleEntryList({
          filter,
          offset: pagination.page,
          limit: pagination.pageSize,
          sort,
          location: "myEntries",
        })
      );
    }
  }, [location, token]);
  useEffect(() => {
    setPagination(() => {
      return { page: offset, pageSize: limit };
    });
  }, [limit, offset]);
  useEffect(() => {}, [_loading]);
  const handleTableChange = async ({
    page,
    pageSize,
    sortModel,
    filterModel,
  }: any) => {
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
    // dispatch(
    //   getRaffleEntryList({
    //     ...query,
    //     ...{ location: "myEntries" },
    //   })
    // );
  };
  return (
    <>
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
            My Entries
          </Typography>
        </Box>
        <CustomizedDataGrid
          sx={{
            width: "100%",
          }}
          headers={headers}
          data={list}
          pagination={pagination}
          onTableChange={(e) => {
            handleTableChange(e);
          }}
          pageLength={count}
          // onEditAction={handleEditAction}
          // onViewAction={handleViewAction}
        />
      </Box>
    </>
  );
}
