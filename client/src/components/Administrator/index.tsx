import { Grid2, Typography, Button } from "@mui/material";
import React, { useEffect } from "react";
import CustomizedDataGrid from "../CustomizedDataFrid";
import headers from "./headers.json";
import { useAppDispatch } from "@/redux/hook";
import { getAdmin } from "@/redux/reducers/user/asnycCalls";
const Index = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAdmin());
  }, []);
  return (
    <Grid2 container spacing={2} columns={12}>
      <Grid2
        sx={{ display: "flex", alignItems: "center" }}
        size={{ xs: 6, sm: 6, lg: 6 }}
      >
        <Typography component="h2" variant="h6">
          Administrator
        </Typography>
      </Grid2>
      <Grid2 size={{ xs: 6, sm: 6, lg: 6 }}>
        <Button
          sx={{
            float: "right",
          }}
          variant="contained"
          onClick={() => {
            alert("here");
          }}
        >
          Add Admin
        </Button>
      </Grid2>
      <Grid2 size={12}>
        {/* <CustomizedDataGrid
          sx={{
            width: "100%",
          }}
          headers={headers}
        /> */}
      </Grid2>
    </Grid2>
  );
};

export default Index;
