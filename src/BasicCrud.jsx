import { Button, TextField, Box, Typography, colors } from "@mui/material";
import { useMemo, useState } from "react";
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
  const { value, customFunc } = props;
  const handleButtonClick = () => {
    // Access the row data via props.data
    console.log("Id: ", props.data.id);
    customFunc(props.data.id);
  };

  return <button onClick={handleButtonClick}>Delete</button>;
};

const ButtonCellRenderer = (props) => {
  const { value, customFunc } = props;
  const handleButtonClick = () => {
    // Access the row data via props.data
    console.log("Id: ", props.data.id);
    customFunc({
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
  const deleteCustomer = async (customerId) => {
    console.log("Id", customerId);
    console.log(baseQuery + "/Customer/DeleteCustomer?id=" + customerId);

    // Replace with your .NET API endpoint
    //       axios.delete('https://api.example.com/items', {
    //   data: { itemId: 'abc-123' }
    // })
    await axios
      .delete(baseQuery + "/Customer/DeleteCustomer/" + customerId)
      .then(function (response) {
        console.log(response);
        viewAll();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

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
    { field: "name" },
    { field: "email" },
    { field: "address" },
    { field: "contact" },
    { field: "birthDate" },
    { field: "nominee" },
    {
      field: "edit",
      headerName: "Edit",
      cellRenderer: ButtonCellRenderer,
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
      },
    },
  ];

  const viewAll = async () => {
    try {
      // Replace with your .NET API endpoint
      const response = await axios.get(baseQuery + "/Customer/GetCustomers");
      console.log(response);
      setApiResponse(response.data.Result);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.message);
      console.log(err.message);
      setApiResponse(null); // Clear any previous data
    }
  };

  const addCustomer = async () => {
    console.log("Test Id", request.id);
    axios
      .post(baseQuery + "/Customer/Register", {
        id: request.id,
        name: request.name,
        email: request.email,
        password: request.password,
        address: request.address,
        contact: request.contact,
        birthDate: new Date(request.dob),
        nominee: null,
      })
      .then(function (response) {
        console.log(response);
        viewAll();
      })
      .catch(function (error) {
        console.log(error);
      });
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
                addCustomer();
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
