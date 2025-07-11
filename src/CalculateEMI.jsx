import "./App.css";
import { Button, TextField, Box, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { AgGridReact } from "ag-grid-react";

var baseQuery = import.meta.env.VITE_API;

function CreateTextField({
  textFieldName,
  requestFieldName,
  handleFunc,
  textStyle,
}) {
  textStyle = textStyle ? "space-between" : "";
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: textStyle,
          padding: 10,
          flexDirection: "row",
        }}
      >
        <Typography display="inline" fontSize={20} style={{ padding: "10px" }}>
          {textFieldName}
        </Typography>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <TextField
            id={requestFieldName}
            variant="outlined"
            style={{ outlineColor: "white" }}
            size="small"
            value={requestFieldName}
            onChange={handleFunc}
            type="number"
          />
          {Number(requestFieldName) < 0 || requestFieldName.length == 0 ? (
            <ErrorOutlineRoundedIcon />
          ) : null}
        </div>
      </div>
    </>
  );
}

export default function CalculateEMI() {
  const [apiResponse, setApiResponse] = useState([{}]);
  const [error, setError] = useState(null);
  const [request, setRequest] = useState({
    loanAmount: "",
    interestRate: "",
    loanTenureInMonths: "",
  });
  const [showGrid, setShowGrid] = useState(false);
  const colDefs = [
    { field: "principal" },
    { field: "interest" },
    { field: "totalPayment" },
    { field: "balance" },
  ];

  function handleLoanAmountChange(e) {
    setRequest({
      ...request,
      loanAmount: e.target.value,
    });
  }

  function handleInterestRateChange(e) {
    setRequest({
      ...request,
      interestRate: e.target.value,
    });
  }

  function handleLoanTenureInMonthsChange(e) {
    setRequest({
      ...request,
      loanTenureInMonths: e.target.value,
    });
  }

  const displayEMI = async () => {
    try {
      // Replace with your .NET API endpoint
      const response = await axios.get(
        baseQuery +
          "/Calculate/CalculateEMIs?loanAmount=" +
          request.loanAmount +
          "&interestRate=" +
          request.interestRate +
          "&loanTenureInMonths=" +
          request.loanTenureInMonths
      );
      setApiResponse(response.data.Result);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.message);
      console.log(error);
      setApiResponse(null); // Clear any previous data
    }
  };

  return (
    <>
      <Box>
        <h1>Loan Management System</h1>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            border={1}
            sx={{ paddingRight: 5, paddingLeft: 5, paddingBottom: 5 }}
          >
            <h2>Calculate EMI</h2>

            <CreateTextField
              textFieldName="Loan Amount"
              requestFieldName={request.loanAmount}
              handleFunc={handleLoanAmountChange}
              textStyle="space-between"
            />
            <CreateTextField
              textFieldName="Interest Rate"
              requestFieldName={request.interestRate}
              handleFunc={handleInterestRateChange}
              textStyle="space-between"
            />
            <CreateTextField
              textFieldName="Loan Tenure in Months"
              requestFieldName={request.loanTenureInMonths}
              handleFunc={handleLoanTenureInMonthsChange}
            />

            <Button
              variant="contained"
              onClick={() => {
                setShowGrid(true);
                displayEMI();
              }}
            >
              Calculate
            </Button>
          </Box>
        </Box>
        {showGrid && (
          <div className="ag-theme-quartz" style={{ height: 400, width: 600 }}>
            <AgGridReact
              pagination
              rowData={apiResponse} // Your data
              columnDefs={colDefs} // Your column definitions
            />
          </div>
        )}
      </Box>
    </>
  );
}
