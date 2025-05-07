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
import headers from "./headers";
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
export function UserTicketDetails() {
  const { totalEntries, totalTicket, totalUsedEntries } = useAppSelector(
    (state) => state.raffleEntry
  );
  const { loading, token } = useAppSelector((state) => state.token);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading) {
      console.log(token);
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
  const { getData } = useAppSelector((state: RootState) => state.ticket);
  const { filter, offset, limit, sort, list, count } = getData;
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
  }, [getData.loading]);
  return (
    <Card>
      <CardHeader
        title="name here"
        subheader="test"
      ></CardHeader>
      <CardContent>
        <Grid2
          container
          spacing={1}
        >
          {/* <Grid2 size={{ xs: 12, md: 12 }}>
            <Box sx={{ padding: "1rem" }}>
              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                sx={{ height: "6.5rem" }}
                divider={
                  <Divider
                    orientation="vertical"
                    flexItem
                  />
                }
              >
                <Paper
                  elevation={1}
                  sx={{ width: "49%", padding: ".7rem" }}
                >
                  <Box
                    sx={{
                      borderBottom: ".1px solid #dadada",
                    }}
                  >
                    <Typography
                      sx={{
                        letterSpacing: "0.0938em",
                        fontFamily: "Outfit Variable",
                        fontWeight: "500",
                      }}
                    >
                      Total Tickets
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        letterSpacing: "0.0938em",
                        fontFamily: "Outfit Variable",
                        textAlign: "center",
                        fontWeight: "600",
                        fontSize: "2rem",
                      }}
                    >
                      {totalTicket}
                    </Typography>
                  </Box>
                </Paper>
                <Paper
                  elevation={1}
                  sx={{ width: "49%", padding: ".7rem" }}
                >
                  <Box sx={{ borderBottom: ".1px solid #dadada" }}>
                    <Typography
                      sx={{
                        letterSpacing: "0.0938em",
                        fontFamily: "Outfit Variable",
                        fontWeight: "500",
                      }}
                    >
                      Total Entries
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        letterSpacing: "0.0938em",
                        fontFamily: "Outfit Variable",
                        textAlign: "center",
                        fontWeight: "600",
                        fontSize: "2rem",
                      }}
                    >
                      {totalEntries}
                    </Typography>
                  </Box>
                </Paper>
                <Paper
                  elevation={1}
                  sx={{ width: "49%", padding: ".7rem" }}
                >
                  <Box sx={{ borderBottom: ".1px solid #dadada" }}>
                    <Typography
                      sx={{
                        letterSpacing: "0.0938em",
                        fontFamily: "Outfit Variable",
                        fontWeight: "500",
                      }}
                    >
                      Used Entries
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        letterSpacing: "0.0938em",
                        fontFamily: "Outfit Variable",
                        textAlign: "center",
                        fontWeight: "600",
                        fontSize: "2rem",
                      }}
                    >
                      {totalUsedEntries}
                    </Typography>
                  </Box>
                </Paper>
              </Stack>
            </Box>
          </Grid2> */}
          <Grid2 size={{ md: 12, xs: 12 }}>
            <Box sx={{ padding: "1rem" }}>
              <CustomizedDataGrid
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
            </Box>
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );
}
