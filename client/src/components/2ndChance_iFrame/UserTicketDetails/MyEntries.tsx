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
      dispatch(getRaffleEntry("myEntries"));
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
  }, [location, pagination, token]);
  useEffect(() => {
    setPagination(() => {
      return { page: offset, pageSize: limit };
    });
  }, [limit, offset]);
  useEffect(() => {
    console.log(count, list);
  }, [_loading]);
  return (
    <>
      <CustomizedDataGridBasic
        sx={{
          width: "100%",
        }}
        headers={headers}
        data={list}
        pagination={pagination}
        // onTableChange={handleTableChange}
        // pageLength={count}
        // onEditAction={handleEditAction}
        // onViewAction={handleViewAction}
      />
    </>
  );
}
