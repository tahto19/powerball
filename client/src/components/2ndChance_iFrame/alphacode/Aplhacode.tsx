//@ts-nocheck
import { openDialog } from "@/redux/reducers/download/exportDataSlice";
import { Grid2, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import tableHeaders from "./json/tableHeaders.tsx";
import CustomizedDataGrid from "@/components/CustomizedDataGrid.tsx";
import { useAppDispatch, useAppSelector } from "@/redux/hook.ts";
import { getDataV2, paginationType } from "@/types/allTypes.js";
import { getAlphaCodeList } from "@/redux/reducers/alphaCode/asyncCalls.ts";
import Dialog_ from "./Dialog/Dialog_.tsx";

function Aplhacode() {
  const [open, setOpen] = useState<Boolean>(false);
  const [pagination, setPagination] = useState<paginationType>({
    page: 0,
    pageSize: 10,
  });

  const [dialogType, setDialogType] = useState<String>("");
  const [toEdit, setToEdit] = useState({});

  const { getData, list, mainLoading, count } = useAppSelector(
    (s) => s.alphaCode
  );
  const { loading, token } = useAppSelector((state) => state.token);
  const { limit, offset, sort, filter } = getData;

  const dispatch = useAppDispatch();

  useEffect(() => {
    setPagination({ page: offset ? offset : 0, pageSize: limit ? limit : 10 });
  }, [limit, offset]);

  useEffect(() => {
    if (token !== null) {
      // this total ticket entry get
      dispatch(getAlphaCodeList({ limit, offset, sort, filter }));
    }
  }, [token]);

  const handleTableChange = async ({
    page,
    pageSize,
    sortModel,
    filterModel,
  }: any) => {
    setPagination({ page, pageSize });

    const sort = [];
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
    dispatch(getAlphaCodeList(query));
  };
  const onClose = () => {
    setOpen(false);
    setDialogType("");
    setToEdit({});
  };

  const handleEditAction = (e) => {
    console.log(e);
    setToEdit({ id: e.id, name: e.name, entries: e.entries });
    setOpen(true);
    setDialogType("Edit");
  };
  return (
    <Grid2
      container
      spacing={2}
      columns={12}
    >
      <Grid2
        sx={{ display: "flex", alignItems: "center" }}
        size={{ xs: 6, sm: 6, lg: 6 }}
      >
        <Typography
          component="h2"
          variant="h6"
        >
          Alpha Code
        </Typography>
      </Grid2>{" "}
      <Grid2 size={{ xs: 6, sm: 6, lg: 6 }}>
        <Button
          sx={{
            float: "right",
          }}
          variant="contained"
          onClick={() => {
            setOpen(true);
            setDialogType("Add");
          }}
        >
          Add Alpha Code
        </Button>
        <Button
          sx={{
            float: "right",
            marginRight: "5px",
          }}
          variant="contained"
          onClick={() =>
            dispatch(openDialog({ title: "Tickets List", type: 3 }))
          }
        >
          Export
        </Button>
      </Grid2>
      <Grid2 size={12}>
        <CustomizedDataGrid
          sx={{
            width: "100%",
          }}
          headers={tableHeaders}
          data={list}
          pagination={pagination}
          onTableChange={handleTableChange}
          pageLength={count}
          onEditAction={handleEditAction}
          //   onViewAction={handleViewAction}
        />
      </Grid2>
      <Dialog_
        dialogType={dialogType}
        open={open}
        loading={mainLoading}
        data={toEdit}
        onClose={(e) => {
          setOpen(e);
        }}
      />
    </Grid2>
  );
}

export default Aplhacode;
