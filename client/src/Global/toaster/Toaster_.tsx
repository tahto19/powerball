import { RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Flip, ToastContainer, toast } from "react-toastify";

const Toaster_ = () => {
  const { message, show, variant, icon, count } = useSelector(
    (state: RootState) => state.global.toasterShow
  );
  useEffect(() => {
    console.log(count, message);
    setTimeout(() => {
      toast(message, {
        type: variant === null || variant === undefined ? "success" : variant,
      });
    }, [150]);
  }, [count]);
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
