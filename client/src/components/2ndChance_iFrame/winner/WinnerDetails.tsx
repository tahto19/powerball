//@ts-nocheck

import CustomizedDataGridBasic from "@/components/CustomizedDataGridBasic";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getWinnerListAsync } from "@/redux/reducers/winner/asyncSlice";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import WinnerDetailsHeaders from "./WinnerDetailsHeaders";
const WinnerDetails = ({ url }: { url: string | undefined }) => {
  const { loading, token } = useAppSelector((state) => state.token);
  const { _loading, filter, offset, limit, sort, list, count } = useAppSelector(
    (state) => state.winner.winnerList
  );
  const dispatch = useAppDispatch();
  // const
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading) {
      if (token === null) {
        navigate("/iframe/2nd-chance/login");
      }
    }
  }, [loading]);
  useEffect(() => {
    if (token !== null) {
      dispatch(
        getWinnerListAsync({
          sort,
          limit,
          offset,
          filter,
          location: url ? url : "myWinners",
        })
      );
    }
  }, [loading, token, location]);
  console.log(list);
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
            List of Winners
          </Typography>
        </Box>
        <CustomizedDataGridBasic
          data={list}
          headers={WinnerDetailsHeaders}
        />
      </Box>
    </>
  );
};

export default WinnerDetails;
