import { RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Flip, ToastContainer, toast } from "react-toastify";

const Toaster_ = () => {
  const { message, show, variant, icon } = useSelector(
    (state: RootState) => state.global.toasterShow
  );
  useEffect(() => {
    if (show) toast(message, { type: !variant ? "success" : variant });
  }, [show]);
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      closeOnClick={true}
      transition={Flip}
    />
  );
};

export default Toaster_;
