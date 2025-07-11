import { Button, TextField, Box, Typography } from "@mui/material";
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "./App.css";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { addCustomer, viewAll, deleteCustomer } from "./axiosAPI.jsx";

function CreateTextField({
  textFieldName,
  type = "",
  textStyle = "",
  handleFunc,
  textValue,
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
            value={textValue}
          />
          <ErrorOutlineRoundedIcon color="error" />
        </div>
      </div>
    </>
  );
}

const DeleteButtonCellRenderer = (props) => {
  const { customFunc: deleteCustomer, setApiResponse, setError } = props;
  const handleButtonClick = () => {
    // Access the row data via props.data
    deleteCustomer(props.data.id, setApiResponse, setError);
  };

  return <button onClick={handleButtonClick}>Delete</button>;
};

const EditCellRenderer = (props) => {
  const { customFunc: editCustomer } = props;
  const handleButtonClick = () => {
    // Access the row data via props.data
    editCustomer({
      id: props.data.id,
      name: props.data.name,
      email: props.data.email,
      contact: props.data.contact,
      address: props.data.address,
      dob: new Date(props.data.birthDate).toISOString().split("T")[0],
    });
  };

  return <button onClick={handleButtonClick}>Edit</button>;
};

export default function ShowForm() {
  const [request, setRequest] = useState({
    id: 0,
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
  const colDefs = [
    { field: "name", headerName: "Name" },
    { field: "email", headerName: "Email" },
    { field: "address", headerName: "Address" },
    { field: "contact", headerName: "Contact" },
    { field: "birthDate", headerName: "Birth Date" },
    { field: "nominee", headerName: "Nominee" },
    {
      field: "edit",
      headerName: "Edit",
      cellRenderer: EditCellRenderer,
      cellRendererParams: {
        customFunc: setRequest,
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      cellRenderer: DeleteButtonCellRenderer,
      cellRendererParams: {
        customFunc: deleteCustomer,
        setApiResponse,
        setError,
      },
    },
  ];

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
            viewAll(setApiResponse, setError);
            console.log(error);
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
            textValue={request.name}
          />
          <CreateTextField
            textFieldName={"Email"}
            type={"email"}
            textStyle={"space-between"}
            handleFunc={handleEmailChange}
            textValue={request.email}
          />
          <CreateTextField
            textFieldName={"Password"}
            type={"password"}
            textStyle={"space-between"}
            handleFunc={handlePasswordChange}
            textValue={request.password}
          />
          <CreateTextField
            textFieldName={"Address"}
            textStyle={"space-between"}
            handleFunc={handleAddressChange}
            textValue={request.address}
          />
          <CreateTextField
            textFieldName={"Contact"}
            textStyle={"space-between"}
            type={"number"}
            handleFunc={handleContactChange}
            textValue={request.contact}
          />
          <CreateTextField
            textFieldName={"BirthDate"}
            type={"date"}
            handleFunc={handleDobChange}
            textValue={request.dob}
          />

          <center>
            <Button
              variant="contained"
              onClick={() => {
                checkValidation();
                addCustomer(request, setApiResponse, setError);
              }}
            >
              Submit
            </Button>
          </center>
        </Box>
      </Box>
      {showGrid && (
        <Box sx={{ display: "flex", justifyContent: "center", margin: 5 }}>
          <div className="ag-theme-quartz" style={{ height: 400, width: 1617 }}>
            <AgGridReact
              pagination
              rowData={apiResponse} // Your data
              columnDefs={colDefs}
            />
          </div>
        </Box>
      )}
    </>
  );
}
