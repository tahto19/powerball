// import DatePicker from "react-datepicker";

// import React from "react";
import { IconButton, TextField } from "@mui/material";
import { CalendarIcon } from "@mui/x-date-pickers/icons";
import moment, { Moment } from "moment";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
interface NewDatePickerInterFace {
  onChangeDate: (d: Date | null) => void | Date | null;
  selectDate: Date | null | undefined | String;
  label: String | undefined;
}
export function NewDatePicker({
  onChangeDate,
  selectDate,
  label,
}: NewDatePickerInterFace) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const yearsOfConsent = moment().subtract(18, "years");

  const range = (year: number) => {
    let latestYear = parseInt(yearsOfConsent.format("YYYY"));
    var years = [];
    for (let i = year; i <= latestYear; i++) {
      years.push(i);
    }

    return years;
  };
  const years = range(1900);
  const getYear = (d: Date) => {
    return parseInt(moment(d).format("YYYY"));
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(yearsOfConsent.toISOString())
  );

  const getMonth = (d: Date) => {
    return parseInt(moment(d).format("M")) - 1;
  };
  return (
    <div style={{ width: "100%", marginTop: "1em" }}>
      <DatePicker
        className="full-width-datepicker"
        customInput={
          <TextField
            size="medium"
            label={label}
            sx={{ width: "100%" }}
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton>
                    <CalendarIcon />
                  </IconButton>
                ),
              },
            }}
          />
        }
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div
            style={{
              margin: 10,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
            >
              {"<"}
            </button>
            <select
              value={getYear(date)}
              onChange={({ target: { value } }) => {
                let v = parseInt(value);
                changeYear(v);
              }}
            >
              {years.map((option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              ))}
            </select>

            <select
              value={months[getMonth(date)]}
              onChange={({ target: { value } }) =>
                changeMonth(months.indexOf(value))
              }
            >
              {months.map((option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              ))}
            </select>

            <button
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
            >
              {">"}
            </button>
          </div>
        )}
        selected={selectedDate}
        onChange={(date) => {
          setSelectedDate(date);
          onChangeDate(date);
        }}
      />
    </div>
  );
}

export default NewDatePicker;
