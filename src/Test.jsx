import { Button, TextField, Box, Typography } from "@mui/material";
import { useState } from "react";
import "./App.css";
import { addCustomer, deleteCustomer, viewAll } from "./axiosAPI.jsx";

export default function ShowForm() {
  let request = {
    id: 0,
    name: "",
    email: "",
    password: "123456",
    address: "",
    contact: "",
    birthDate: "",
  };
  const [showGrid, setShowGrid] = useState(false);
  const [apiResponse, setApiResponse] = useState([{}]);
  const [error, setError] = useState(null);
  const [isNewRow, setIsNewRow] = useState(false);
  const [isUpdated, setIsUpdated] = useState({ index: "" });

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
        index: "New_" + (apiResponse.length + 1),
        id: 0,
        name: "",
        contact: "",
        birthDate: "",
        nominee: "",
        email: "",
        address: "",
      },
    ]);

    console.log(apiResponse);
  }

  function handleNameChange(e, index) {
    setApiResponse((apiResponse) =>
      apiResponse.map((customer) => {
        if (customer.index === index) {
          return { ...customer, name: e.target.value };
        } else {
          return customer;
        }
      })
    );
  }

  function handleEmailChange(e, index) {
    setApiResponse((apiResponse) =>
      apiResponse.map((customer) => {
        if (customer.index === index) {
          return { ...customer, email: e.target.value };
        } else {
          return customer;
        }
      })
    );
  }

  function handleAddressChange(e, index) {
    setApiResponse((apiResponse) =>
      apiResponse.map((customer) => {
        if (customer.index === index) {
          return { ...customer, address: e.target.value };
        } else {
          return customer;
        }
      })
    );
  }

  function handleContactChange(e, index) {
    setApiResponse((apiResponse) =>
      apiResponse.map((customer) => {
        if (customer.index === index) {
          return { ...customer, contact: e.target.value };
        } else {
          return customer;
        }
      })
    );
  }

  function handleBirthDateChange(e, index) {
    setApiResponse((apiResponse) =>
      apiResponse.map((customer) => {
        if (customer.index === index) {
          return { ...customer, birthDate: e.target.value };
        } else {
          return customer;
        }
      })
    );
  }

  function handleNomineeChange(e, index) {
    setApiResponse((apiResponse) =>
      apiResponse.map((customer) => {
        if (customer.index === index) {
          return { ...customer, nominee: e.target.value };
        } else {
          return customer;
        }
      })
    );
  }

  function saveCustomer(index) {
    var x = apiResponse.find((item) => item.index === index);
    request = {
      ...request,
      id: x.id,
      name: x.name,
      email: x.email,
      address: x.address,
      contact: x.contact,
      birthDate: x.birthDate,
    };
    addCustomer(request, setApiResponse, setError);
    setIsUpdated({ index: "" });
    setIsNewRow(false);
  }

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => {
          addRowInTable();
        }}
        style={{ margin: "5px" }}
        disabled={isUpdated.index.length > 0 || isNewRow}
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
                {apiResponse.map((item) => (
                  <tr>
                    <td>
                      {(isNewRow &&
                        item["index"].toString().startsWith("New_")) ||
                      isUpdated.index == item["index"] ? (
                        <input
                          value={item["name"]}
                          onChange={(e) => {
                            handleNameChange(e, item["index"]);
                          }}
                        />
                      ) : (
                        item["name"]
                      )}
                    </td>
                    <td>
                      {isNewRow &&
                      item["index"].toString().startsWith("New_") ? (
                        <input
                          onChange={(e) => {
                            handleEmailChange(e, item["index"]);
                          }}
                        />
                      ) : (
                        item["email"]
                      )}
                    </td>
                    <td>
                      {isNewRow &&
                      item["index"].toString().startsWith("New_") ? (
                        <input
                          onChange={(e) => {
                            handleAddressChange(e, item["index"]);
                          }}
                        />
                      ) : (
                        item["address"]
                      )}
                    </td>
                    <td>
                      {isNewRow &&
                      item["index"].toString().startsWith("New_") ? (
                        <input
                          onChange={(e) => {
                            handleContactChange(e, item["index"]);
                          }}
                        />
                      ) : (
                        item["contact"]
                      )}
                    </td>
                    <td>
                      {isNewRow &&
                      item["index"].toString().startsWith("New_") ? (
                        <input
                          onChange={(e) => {
                            handleBirthDateChange(e, item["index"]);
                          }}
                        />
                      ) : (
                        item["birthDate"]
                      )}
                    </td>
                    <td>
                      {isNewRow &&
                      item["index"].toString().startsWith("New_") ? (
                        <input
                          onChange={(e) => {
                            handleNomineeChange(e, item["index"]);
                          }}
                        />
                      ) : (
                        item["nominee"]
                      )}
                    </td>
                    <td>
                      {(isNewRow && item["id"] == "") ||
                      isUpdated.index == item["index"] ? (
                        <button onClick={() => saveCustomer(item["index"])}>
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setIsUpdated({ index: item["index"], edit: true });
                            console.log(isUpdated["index"]);
                          }}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                    <td>
                      {(isNewRow && item["id"] == "") ||
                      isUpdated.index == item["index"] ? (
                        <button>Cancel</button>
                      ) : (
                        <button
                          onClick={() =>
                            deleteCustomer(item["id"], setApiResponse, setError)
                          }
                        >
                          Delete
                        </button>
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
