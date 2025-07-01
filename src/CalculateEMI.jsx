import "./App.css";
import { Button, TextField, Box, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

var baseQuery = import.meta.env.VITE_API;
export default function CalculateEMI() {
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);
  const [request, setRequest] = useState({
    loanAmount: "",
    interestRate: "",
    loanTenureInMonths: "",
  });

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
          "/api/Calculate/CalculateEMIs?loanAmount=" +
          request.loanAmount +
          "&interestRate=" +
          request.interestRate +
          "&loanTenureInMonths=" +
          request.loanTenureInMonths
      );
      setApiResponse(response.data);
      console.log(response.data);
      console.log("Request", request);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.message);
      setApiResponse(null); // Clear any previous data
    }
  };

  return (
    <>
      <h1>Loan Management System</h1>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box
          border={1}
          sx={{ paddingRight: 5, paddingLeft: 5, paddingBottom: 5 }}
        >
          <h2>Calculate EMI</h2>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 10,
            }}
          >
            <Typography
              display="inline"
              fontSize={20}
              style={{ padding: "10px" }}
            >
              Loan Amount
            </Typography>
            <TextField
              id="loanAmount"
              variant="outlined"
              style={{ outlineColor: "white" }}
              size="small"
              value={request.loanAmount}
              onChange={handleLoanAmountChange}
              type="number"
            />
            {Number(request.loanAmount) < 0 ||
            request.loanAmount.length <= 0 ? (
              <ErrorOutlineRoundedIcon />
            ) : null}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 10,
            }}
          >
            <Typography
              display="inline"
              fontSize={20}
              style={{ padding: "10px" }}
            >
              Interest Rate
            </Typography>
            <TextField
              id="interestRate"
              variant="outlined"
              style={{ outlineColor: "white" }}
              size="small"
              value={request.interestRate}
              onChange={handleInterestRateChange}
              type="number"
            />
            {Number(request.interestRate) < 0 ||
            request.interestRate.length <= 0 ? (
              <ErrorOutlineRoundedIcon />
            ) : null}
          </div>
          <div style={{ display: "flex", padding: 10 }}>
            <Typography
              display="inline"
              fontSize={20}
              style={{ padding: "10px" }}
            >
              Loan Tenure in Months
            </Typography>
            <TextField
              id="loanTenureInMonths"
              variant="outlined"
              style={{ outlineColor: "white" }}
              size="small"
              value={request.loanTenureInMonths}
              onChange={handleLoanTenureInMonthsChange}
              type="number"
            />
            {Number(request.loanTenureInMonths) < 0 ||
            request.loanTenureInMonths.length <= 0 ? (
              <ErrorOutlineRoundedIcon />
            ) : null}
          </div>

          <Button variant="contained" onClick={displayEMI}>
            test
          </Button>
        </Box>
      </Box>
    </>
  );
}
