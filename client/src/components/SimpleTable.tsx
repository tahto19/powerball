//@ts-nocheck
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React from "react";

export function SimpleTable({
  headers,
  items,
}: {
  headers: GridColDef[];
  items: unknown;
}) {
  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {headers &&
                headers.map((v, i) => (
                  <TableCell
                    align="center"
                    key={i}
                  >
                    {v?.headerName}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items &&
              items.map((v, i) => (
                <TableRow key={i}>
                  {headers.map((vv, ii) => {
                    const val = v[vv.headerName];
                    return <TableCell key={ii}>{val}</TableCell>;
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
