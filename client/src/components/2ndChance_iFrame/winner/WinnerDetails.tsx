//@ts-nocheck
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getWinnerListAsync } from "@/redux/reducers/winner/asyncSlice";
import React, { useEffect } from "react";

const WinnerDetails = () => {
  const { loading, token } = useAppSelector((state) => state.token);
  const { _loading, filter, offset, limit, sort, list, count } = useAppSelector(
    (state) => state.winner.winnerList
  );
  const dispatch = useAppDispatch();
  // const
  // useEffect(() => {
  //   if (list.length === 0 && token !== null) {
  //     dispatch(getWinnerListAsync({ limit, offset, filter, count, location }));
  //   }
  // }, [loading, token, list, location]);
  return <></>;
};

export default WinnerDetails;
