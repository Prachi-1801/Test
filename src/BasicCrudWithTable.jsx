import { Button, TextField, Box, Typography } from "@mui/material";
import { useState } from "react";
import "./App.css";
import { viewAll } from "./axiosAPI.jsx";

const DeleteButtonCellRenderer = (props) => {
  const { customFunc: deleteCustomer } = props;
  const handleButtonClick = () => {
    // Access the row data via props.data
    deleteCustomer(props.data.id);
  };

  return <button onClick={handleButtonClick}>Delete</button>;
};

const EditCellRenderer = (props) => {
  console.log("Edit");
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
  //   const [request, setRequest] = useState({
  //     id: 0,
  //     name: "",
  //     email: "",
  //     password: "",
  //     address: "",
  //     contact: "",
  //     dob: "",
  //   });
  const [showGrid, setShowGrid] = useState(false);
  const [apiResponse, setApiResponse] = useState([{}]);
  const [error, setError] = useState(null);
  const [isNewRow, setIsNewRow] = useState(false);
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
    },
    {
      field: "delete",
      headerName: "Delete",
    },
  ];

  function addRowInTable() {
    setIsNewRow(true);
    setApiResponse([
      ...apiResponse,
      {
        index: apiResponse.length + 1,
        id: "",
        name: "",
        contact: "",
        birthDate: "",
        nominee: "",
        email: "",
        address: "",
      },
    ]);
  }

  function handleNameChange(e, index) {
    console.log(
      "Index",
      index,
      e.target.value,
      apiResponse.find((element) => element["index"] == index)
    );
    setApiResponse({
      ...apiResponse,
      //   apiResponse.name:e.target.value
    });
  }

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => {
          addRowInTable();
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
            viewAll(setApiResponse, setError);
            console.log(error);
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
                {apiResponse.map((item, index) => (
                  <tr>
                    <td>
                      {isNewRow && item["name"] == "" ? (
                        <input
                          onChange={(e) => {
                            handleNameChange(e, index);
                          }}
                        />
                      ) : (
                        item["name"]
                      )}
                    </td>
                    <td>
                      {isNewRow && item["email"] == "" ? (
                        <input />
                      ) : (
                        item["email"]
                      )}
                    </td>
                    <td>
                      {isNewRow && item["address"] == "" ? (
                        <input />
                      ) : (
                        item["address"]
                      )}
                    </td>
                    <td>
                      {isNewRow && item["contact"] == "" ? (
                        <input />
                      ) : (
                        item["contact"]
                      )}
                    </td>
                    <td>
                      {isNewRow && item["birthDate"] == "" ? (
                        <input />
                      ) : (
                        item["birthDate"]
                      )}
                    </td>
                    <td>
                      {isNewRow && item["nominee"] == "" ? (
                        <input />
                      ) : (
                        item["nominee"]
                      )}
                    </td>
                    <td>
                      <button>
                        {isNewRow && item["id"] == "" ? "Save" : "Edit"}
                      </button>
                    </td>
                    <td>
                      {isNewRow ? (
                        <button>Cancel</button>
                      ) : (
                        <button>Delete</button>
                      )}
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
