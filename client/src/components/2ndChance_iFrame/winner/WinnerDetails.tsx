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
import CustomizedDataGrid from "@/components/CustomizedDataGrid";
const WinnerDetails = ({ url }: { url: string | undefined }) => {
  const { myPermission } = useAppSelector((state: RootState) => state.userType);

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
          location: url ? url : "myWinners", //added this because client want to change it to see all winners
          // location: url ? url : url,
        })
      );
    }
  }, [token, location]);
  const [headers, setHeaders] = useState([]);
  const [rowClicked, setRowClicked] = useState();
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState([]);
  const handleRowClick = async (e, type) => {
    try {
      if (!myPermission.winners.edit) throw new Error("your not Allow to Edit");
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
      console.log("Decrypted image data:", imageUploaded);

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

  const [open, setOpen] = useState(false);
  const [pagination, setPagination] = useState<paginationType>({
    page: 0,
    pageSize: 10,
  });
  const onClose = () => {
    setOpen(false);
    setRowClicked([]);
  };
  useEffect(() => {
    setPagination(() => {
      return { page: offset, pageSize: limit };
    });
  }, [limit, offset]);
  useEffect(() => {
    if (url === "getDataAll") {
      let h = adminWinnerDetailsHeaders(handleRowClick);
      setHeaders(h);
    } else setHeaders(WinnerDetailsHeaders);
  }, [url]);
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
  const handleTableChange = async ({
    page,
    pageSize,
    sortModel,
    filterModel,
  }: any) => {
    setPagination({ page, pageSize });

    const sort = [["id", "DESC"]];
    if (sortModel.length > 0) {
      sort.push([sortModel[0].field, sortModel[0].sort.toUpperCase()]);
    }

    let newFilterModel = [];

    if (filterModel.items.length > 0) {
      newFilterModel = JSON.parse(JSON.stringify(filterModel)).items.map(
        (x: any) => {
          x.filter = x.value;
          x.type = "string";

          delete x.value;
          delete x.fromInput;
          delete x.id;
          delete x.operator;
          return x;
        }
      );
    }

    const query: getDataV2 = {
      offset: page,
      limit: pageSize,
      sort: sort,
      filter: newFilterModel,
    };
    dispatch(
      getWinnerListAsync({
        ...query,
        location: url ? url : "myWinners",
      })
    );
    // dispatch(
    //   getRaffleEntryList({
    //     ...query,
    //     ...{ location: "myEntries" },
    //   })
    // );
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
          {url && myPermission.winners.export && (
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
          )}
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
        <CustomizedDataGrid
          data={list}
          headers={headers}
          pagination={pagination}
          onTableChange={(e) => {
            handleTableChange(e);
          }}
          pageLength={count}
          isAction={false}
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
