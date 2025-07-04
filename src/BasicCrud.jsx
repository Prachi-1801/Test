import { Button, TextField, Box, Typography } from "@mui/material";
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import "./App.css";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

var baseQuery = import.meta.env.VITE_API;

function CreateTextField({
  textFieldName,
  type = "",
  textStyle = "",
  handleFunc,
}) {
  return (
    <>
      <div
        style={{
          display: "flex",
          padding: 10,
          flexDirection: "row",
          justifyContent: textStyle,
        }}
      >
        <Typography display="inline" fontSize={20} style={{ padding: "10px" }}>
          {textFieldName}
        </Typography>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <TextField
            id={textFieldName}
            onChange={handleFunc}
            variant="outlined"
            style={{ outlineColor: "white" }}
            size="small"
            type={type}
          />
          {/* {Number(requestFieldName) < 0 || requestFieldName.length == 0 ? ( */}
          <ErrorOutlineRoundedIcon />
          {/* ) : null} */}
        </div>
      </div>
    </>
  );
}

export default function ShowForm() {
  const [request, setRequest] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    contact: "",
    dob: "",
  });
  const [showGrid, setShowGrid] = useState(false);
  const [apiResponse, setApiResponse] = useState([{}]);
  const [error, setError] = useState(null);
  const [colDefs, setColDefs] = useState([
    { field: "name" },
    { field: "email" },
    { field: "address" },
    { field: "contact" },
    { field: "birthDate" },
    { field: "nominee" },
  ]);

  const viewAll = async () => {
    try {
      // Replace with your .NET API endpoint
      const response = await axios.get(baseQuery + "/Customer/GetCustomers");
      setApiResponse(response.data.Result);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.message);
      console.log(err.message);
      setApiResponse(null); // Clear any previous data
    }
  };

  function handleNameChange(e) {
    setRequest({
      ...request,
      name: e.target.value,
    });
  }

  function handleEmailChange(e) {
    setRequest({
      ...request,
      email: e.target.value,
    });
  }

  function handlePasswordChange(e) {
    setRequest({
      ...request,
      password: e.target.value,
    });
  }

  function handleAddressChange(e) {
    setRequest({
      ...request,
      address: e.target.value,
    });
  }

  function handleContactChange(e) {
    setRequest({
      ...request,
      contact: e.target.value,
    });
  }

  function handleDobChange(e) {
    setRequest({
      ...request,
      dob: e.target.value,
    });
  }

  function checkValidation() {}

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => {
          if (!showGrid) {
            setShowGrid(true);
            viewAll();
          } else {
            setShowGrid(false);
          }
        }}
      >
        {!showGrid ? "View" : "Hide"} All
      </Button>
      <Box sx={{ display: "flex", justifyContent: "center", margin: 5 }}>
        <Box
          border={1}
          sx={{
            paddingRight: 5,
            paddingLeft: 5,
            paddingBottom: 5,
          }}
        >
          <h2>Add Customer</h2>
          <CreateTextField
            textFieldName={"Name"}
            textStyle={"space-between"}
            handleFunc={handleNameChange}
          />
          <CreateTextField
            textFieldName={"Email"}
            type={"email"}
            textStyle={"space-between"}
            handleFunc={handleEmailChange}
          />
          <CreateTextField
            textFieldName={"Password"}
            type={"password"}
            textStyle={"space-between"}
            handleFunc={handlePasswordChange}
          />
          <CreateTextField
            textFieldName={"Address"}
            textStyle={"space-between"}
            handleFunc={handleAddressChange}
          />
          <CreateTextField
            textFieldName={"Contact"}
            textStyle={"space-between"}
            type={"number"}
            handleFunc={handleContactChange}
          />
          <CreateTextField
            textFieldName={"BirthDate"}
            type={"date"}
            handleFunc={handleDobChange}
          />

          <center>
            <Button
              variant="contained"
              onClick={() => {
                checkValidation();
                addCustomer();
              }}
            >
              Submit
            </Button>
          </center>
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
    </>
  );
}
