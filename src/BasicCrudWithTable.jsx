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
  const { value, customFunc: deleteCustomer } = props;
  const handleButtonClick = () => {
    // Access the row data via props.data
    console.log("Id: ", props.data.id);
    deleteCustomer(props.data.id);
  };

  return <button onClick={handleButtonClick}>Delete</button>;
};

const EditCellRenderer = (props) => {
  const { value, customFunc: editCustomer } = props;
  const handleButtonClick = () => {
    // Access the row data via props.data
    console.log("Id: ", props.data.id);
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
  const deleteCustomer = async (customerId) => {
    try {
      await axios.delete(baseQuery + "/Customer/DeleteCustomer/" + customerId);
      viewAll();
    } catch (error) {
      console.log(error);
    }
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
      },
    },
  ];

  const viewAll = async () => {
    try {
      // Replace with your .NET API endpoint
      console.log("test view");
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
    try {
      await axios.post(baseQuery + "/Customer/Register", {
        id: request.id,
        name: request.name,
        email: request.email,
        password: request.password,
        address: request.address,
        contact: request.contact,
        birthDate: new Date(request.dob),
        nominee: null,
      });
      viewAll();
    } catch (error) {
      console.log(error);
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
          document.getElementById("#customerTable");
        }}
        style={{ margin: "5px" }}
      >
        Add
      </Button>

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
      {showGrid && (
        <Box sx={{ display: "flex", justifyContent: "center", margin: 5 }}>
          <div
            className="ag-theme-quartz"
            style={{ height: 400, width: "inherit" }}
          >
            <table id="customerTable" style={{ border: "1px solid black" }}>
              <thead>
                <tr>
                  {colDefs.map((item) => (
                    <th key={item.field}>{item.headerName}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {apiResponse.map((item) => (
                  <tr>
                    <td>{item["name"]}</td>
                    <td>{item["email"]}</td>
                    <td>{item["address"]}</td>
                    <td>{item["contact"]}</td>
                    <td>{item["birthDate"]}</td>
                    <td>{item["nominee"]}</td>
                    <td>
                      <button>Edit</button>
                    </td>
                    <td>
                      <button key={item[0]}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Box>
      )}
    </>
  );
}
