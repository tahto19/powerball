//@ts-nocheck

import CustomizedDataGridBasic from "@/components/CustomizedDataGridBasic";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getWinnerListAsync } from "@/redux/reducers/winner/asyncSlice";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import WinnerDetailsHeaders from "./WinnerDetailsHeaders";
import adminWinnerDetailsHeaders from "./adminWinnerDetailsHeaders";
import ImageUploaderDialog from "@/Global/ImageUploader/ImageUploaderDialog";
import { toast } from "react-toastify";
import { bodyDecrypt, delay } from "@/utils/util";
import apiService from "@/services/apiService";
import { openDialog } from "@/redux/reducers/download/exportDataSlice";
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
  const [headers, setHeaders] = useState([]);
  const [rowClicked, setRowClicked] = useState();
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState([]);
  const handleRowClick = async (e, type) => {
    try {
      setImageLoading(true);

      const getFile = await apiService.getFile(
        {
          filter: [{ field: "winnerId", filter: e.id, type: "number" }],
          sort: [],
          limit: 1,
          offset: 0,
        },
        token
      );

      const d = bodyDecrypt(getFile.data, token);
      const data = d.data.list;
      if (data.length > 0) {
        data[0].action_type = type;
      }
      setImageUploaded(data);
      console.log("Decrypted image data:", imageUploaded); // ✅ correct log

      setImageLoading(false);
    } catch (err) {
      console.log(err);
      const responseData = err.response?.data?.message || err.message;
      toast.error("Error: " + responseData);
      setImageLoading(false);
    }

    setRowClicked(e);
    setOpen(true);
  };

  useEffect(() => {
    if (url === "getDataAll") {
      let h = adminWinnerDetailsHeaders(handleRowClick);
      setHeaders(h);
    } else setHeaders(WinnerDetailsHeaders);
  }, [url]);

  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
    setRowClicked([]);
  };

  const handleSubmitForm = async (d) => {
    const tid = toast.loading("Uploading file");
    try {
      setImageLoading(true);
      console.log(d);
      // await delay(2000);
      d["winnerId"] = rowClicked.id;
      var res;
      if (imageUploaded.length === 0) {
        res = await apiService.createImage(d, token);
      } else {
        res = await apiService.updateImage(d, token);
      }

      toast.update(tid, {
        render: "uploaded successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setImageLoading(false);
    } catch (err) {
      const responseData = err.response?.data?.message || err.message;
      toast.update(tid, {
        render: "Error Uploading!: " + responseData,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
      setImageLoading(false);
      console.log(err);
    }
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
            List of Winners
          </Typography>
          <Button
            sx={{
              float: "right",
              marginRight: "5px",
            }}
            variant="contained"
            onClick={() =>
              dispatch(openDialog({ title: "Winners List", type: 15 }))
            }
          >
            Export
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            justifyContent: "space-between",
            mb: "20px",
          }}
        ></Box>
        <CustomizedDataGridBasic
          data={list}
          headers={headers}
        />
        <ImageUploaderDialog
          open={open}
          onClose={onClose}
          handleSubmitForm={handleSubmitForm}
          loading={imageLoading}
          imageUploaded={imageUploaded}
        />
      </Box>
    </>
  );
};

export default WinnerDetails;
