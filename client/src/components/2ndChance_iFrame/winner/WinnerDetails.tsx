//@ts-nocheck

import CustomizedDataGridBasic from "@/components/CustomizedDataGridBasic";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getWinnerListAsync } from "@/redux/reducers/winner/asyncSlice";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
      console.log(token);
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
  return (
    <>
      <CustomizedDataGridBasic
        data={list}
        headers={WinnerDetailsHeaders}
      />
    </>
  );
};

export default WinnerDetails;
