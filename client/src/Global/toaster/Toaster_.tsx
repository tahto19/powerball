import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Flip, ToastContainer, toast } from "react-toastify";

const Toaster_ = () => {
  const { message, variant, count } = useSelector(
    (state: RootState) => state.global.toasterShow
  );
  useEffect(() => {
    toast(message, {
      type: variant === null || variant === undefined ? "success" : variant,
    });
  }, [count]);
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        closeOnClick={true}
        transition={Flip}
        theme="colored"
      />
    </>
  );
};

export default Toaster_;
