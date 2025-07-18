import { Button, TextField, Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
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
    nominee: "",
  };
  const [showGrid, setShowGrid] = useState(false);
  const [apiResponse, setApiResponse] = useState([{}]);
  const [error, setError] = useState(null);
  const [isNewRow, setIsNewRow] = useState([]);
  const [isUpdated, setIsUpdated] = useState([]);

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
    let index = "New_" + (apiResponse.length + 1);
    setIsNewRow([...isNewRow, { index: index, newRow: true }]);
    setApiResponse([
      ...apiResponse,
      {
        index: index,
        id: 0,
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

  useEffect(() => {
    return console.log("EFFECT: ", apiResponse);
  }, [apiResponse]);

  async function saveCustomer(index) {
    var x = apiResponse.find((item) => item.index === index);
    request = {
      ...request,
      id: x.id,
      name: x.name,
      email: x.email,
      address: x.address,
      contact: x.contact,
      birthDate: x.birthDate,
      nominee: x.nominee,
    };
    let id = await addCustomer(request).then((result) => {
      return result;
    });
    setApiResponse((apiResponse) =>
      apiResponse.map((customer) => {
        if (customer.index === index) {
          return { ...customer, id: id, index: "" };
        } else {
          return customer;
        }
      })
    );

    setIsUpdated(isUpdated.filter((x) => x.index != index));
    setIsNewRow(() => isNewRow.filter((x) => x.index != index));
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
                {apiResponse.map((item) => (
                  <tr>
                    {colDefs.map((col) => {
                      //   console.log(item);
                      return addTableData(
                        isNewRow,
                        item,
                        isUpdated,
                        col.field.toString(),
                        setApiResponse
                      );
                    })}
                    <td>
                      {(isNewRow.find((x) => x.index == item["index"])
                        ?.newRow &&
                        item["id"] == "") ||
                      isUpdated.find((x) => x.index == item["index"])?.edit ? (
                        <button onClick={() => saveCustomer(item["index"])}>
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setIsUpdated([
                              ...isUpdated,
                              { index: item["index"], edit: true },
                            ]);
                          }}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                    <td>
                      {(isNewRow.find((x) => x.index == item["index"])
                        ?.newRow &&
                        item["id"] == "") ||
                      isUpdated.find((x) => x.index == item["index"])?.edit ? (
                        <button
                          onClick={() => {
                            if (
                              isNewRow.find((x) => x.index == item["index"])
                                ?.newRow
                            )
                              setApiResponse(
                                apiResponse.filter(
                                  (x) => x.index != item["index"]
                                )
                              );
                            setIsNewRow((item) =>
                              item.map((value) => {
                                if (value.index === item["index"]) {
                                  return { ...value, isNewRow: false };
                                } else {
                                  return item;
                                }
                              })
                            );
                            setIsUpdated((item) =>
                              item.map((value) => {
                                if (value.index === item["index"]) {
                                  return { ...value, edit: false };
                                } else {
                                  return item;
                                }
                              })
                            );
                          }}
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            let statusCode = await deleteCustomer(
                              item["id"]
                            ).then((result) => {
                              return result;
                            });
                            if (statusCode == 200) {
                              setApiResponse(
                                apiResponse.filter((x) => x.id != item["id"])
                              );
                            }
                          }}
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

function addTableData(
  isNewRow,
  item,
  isUpdated,
  fieldName,
  setApiResponse,
  type = ""
) {
  console.log("FieldName", fieldName);
  return (
    <td>
      {(isNewRow.find((x) => x.index == item["index"])?.newRow &&
        item["index"].toString().startsWith("New_")) ||
      isUpdated.find((x) => x.index == item["index"])?.edit ? (
        <input
          type={type != "" ? type : ""}
          value={
            type != "date"
              ? item[fieldName]
              : item[fieldName] != ""
              ? new Date(item[fieldName]).toISOString().split("T")[0]
              : ""
          }
          onChange={(e) => {
            setApiResponse((apiResponse) =>
              apiResponse.map((customer) => {
                if (customer.index === item["index"]) {
                  return { ...customer, fieldName: e.target.value };
                } else {
                  return customer;
                }
              })
            );
          }}
        />
      ) : (
        item[fieldName]
      )}
    </td>
  );
}
