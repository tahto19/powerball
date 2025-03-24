import { RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Slide, ToastContainer, toast } from "react-toastify";

const Toaster_ = () => {
  const { message, show, variant, icon } = useSelector(
    (state: RootState) => state.global.toasterShow
  );
  useEffect(() => {
    console.log({ message, show, variant, icon });

    toast("Wow so easy!");
  }, [show]);
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      closeOnClick={true}
      transition={Slide}
    />
  );
};

export default Toaster_;
