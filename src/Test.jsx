import { useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Button, Box, Grid, Input, TextField } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { addCustomer, deleteCustomer, viewAll } from "./axiosAPI";
import Pagination from "./Pagination";
import "./App.css";

export function AddTableData({
  column,
  item,
  setApiResponse,
  apiResponse,
  setFilteredApiResponse,
}) {
  const [isInputValid, setIsInputValid] = useState(true);
  const fieldName = useMemo(() => column.field, [column.field]);

  return (
    <td>
      {column?.cellRenderer ? (
        column.cellRenderer(item)
      ) : item["index"].toString().startsWith("New_") || item["isUpdated"] ? (
        <input
          type={column.isDate ? "date" : ""}
          maxLength={column.maxLength}
          value={item[fieldName]}
          className={isInputValid ? "" : "invalid-input"}
          onChange={(e) => {
            setIsInputValid(
              "maxLength" in column
                ? e.target.value.length == column.maxLength
                : true
            );
            let originalApiResponse = apiResponse.map((customer) => {
              if (customer.index === item["index"]) {
                return { ...customer, [fieldName]: e.target.value };
              } else {
                return customer;
              }
            });
            setApiResponse(originalApiResponse);
            setFilteredApiResponse(originalApiResponse);
          }}
        />
      ) : (
        item[fieldName]
      )}
    </td>
  );
}

const ShowForm = () => {
  const [showGrid, setShowGrid] = useState(false);
  const [apiResponse, setApiResponse] = useState([]);
  const [filteredApiResponse, setFilteredApiResponse] = useState([]);
  const [error, setError] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(2);
  const [sortOrder, setSortOrder] = useState({ name: "", sort: "" });

  const editCellRenderer = (item) => {
    const handleEdit = () => {
      setApiResponse((apiResponse) =>
        apiResponse.map((customer) => {
          if (customer.index === item["index"]) {
            return { ...customer, isUpdated: true };
          } else {
            return customer;
          }
        })
      );
      setFilteredApiResponse(apiResponse);
    };

    return (item["index"].toString().startsWith("New_") && item["id"] == "") ||
      item["isUpdated"] ? (
      <button onClick={() => saveCustomer(item["index"])}>Save</button>
    ) : (
      <button onClick={handleEdit}>Edit</button>
    );
  };
  const deleteCellRenderer = (item) => {
    const handleCancel = () => {
      if (item["index"].toString().startsWith("New_"))
        setApiResponse(apiResponse.filter((x) => x.index != item["index"]));
      setApiResponse((apiResponse) =>
        apiResponse.map((customer) => {
          if (customer.index === item["index"]) {
            return { ...customer, isUpdated: false };
          } else {
            return customer;
          }
        })
      );
      setFilteredApiResponse(apiResponse);
    };

    const handleDelete = async () => {
      let statusCode = await deleteCustomer(item["id"]);
      if (statusCode == 200) {
        notifySuccess();
        setApiResponse(apiResponse.filter((x) => x.id != item["id"]));
        setFilteredApiResponse(apiResponse);
      } else {
        notifyError(statusCode);
      }
    };
    return (item["index"].toString().startsWith("New_") && item["id"] == "") ||
      item["isUpdated"] ? (
      <button onClick={handleCancel}>Cancel</button>
    ) : (
      <button onClick={handleDelete}>Delete</button>
    );
  };

  const colDefs = [
    { field: "name", headerName: "Name", sortable: true },
    { field: "email", headerName: "Email", sortable: true },
    { field: "address", headerName: "Address", sortable: true },
    {
      field: "contact",
      headerName: "Contact",
      minLength: 10,
      maxLength: 10,
    },
    {
      field: "birthDate",
      headerName: "Birth Date",
      sortable: true,
      isDate: true,
    },
    { field: "nominee", headerName: "Nominee", sortable: false },
    {
      field: "edit",
      headerName: "Edit",
      cellRenderer: editCellRenderer,
    },
    {
      field: "delete",
      headerName: "Delete",
      cellRenderer: deleteCellRenderer,
    },
  ];

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

  const notifySuccess = () => toast.success("Success!");
  const notifyError = (err) => toast.error(err);

  function addRowInTable() {
    let i = 1;
    let index = "New_" + i;
    let newApiResponse = [
      {
        index: index,
        id: 0,
        name: "",
        contact: "",
        birthDate: new Date(),
        nominee: "",
        email: "",
        address: "",
      },
      ...apiResponse.map((customer) => {
        i++;
        if (customer.index.toString().includes("New_")) {
          return { ...customer, index: "New_" + i };
        }
        return { ...customer, index: i };
      }),
    ];
    setApiResponse(newApiResponse);
    console.log("Before", filteredApiResponse);
    setFilteredApiResponse(newApiResponse);
    console.log("After", filteredApiResponse);
  }

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
    let id = await addCustomer(request);
    if (Number(id)) {
      notifySuccess();
      let newApiResponse = apiResponse.map((customer) => {
        if (customer.index === index) {
          return { ...customer, id: id, index: "", isUpdated: false };
        } else {
          return customer;
        }
      });
      setApiResponse(newApiResponse);
      setFilteredApiResponse(newApiResponse);
    } else notifyError(id);
  }

  return (
    <>
      <ToastContainer />
      <Box display={"flex"} justifyContent={"center"} gap={"10px"}>
        <Button
          variant="outlined"
          onClick={() => {
            addRowInTable();
          }}
        >
          Add
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            if (!showGrid) {
              setShowGrid(true);
              viewAll(setApiResponse, setFilteredApiResponse, setError);
              setFilteredApiResponse(apiResponse);
              console.log(error);
            } else {
              setShowGrid(false);
            }
          }}
        >
          {!showGrid ? "View" : "Hide"} All
        </Button>
        <TextField
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          onChange={(e) => {
            setFilteredApiResponse(() =>
              [...apiResponse].filter((x) =>
                x.name.toLowerCase().includes(e.target.value.toLowerCase())
              )
            );
          }}
        />
      </Box>
      {showGrid && (
        <Grid container justifyContent="center">
          <Box
            sx={{
              margin: 5,
              border: "1px solid black",
            }}
          >
            <table id="customerTable">
              <thead>
                <tr>
                  {colDefs.map((item) => (
                    <th
                      key={item.field}
                      onClick={() => {
                        if (item.sortable) {
                          let currentSortOrder = { name: "", sort: "" };
                          if (
                            sortOrder.sort == "" ||
                            sortOrder.name != item.field
                          ) {
                            currentSortOrder.name = item.field;
                            currentSortOrder.sort = "asc";
                          } else if (sortOrder.sort == "asc") {
                            currentSortOrder.name = item.field;
                            currentSortOrder.sort = "desc";
                          }
                          setSortOrder(currentSortOrder);
                          setFilteredApiResponse(() =>
                            currentSortOrder.sort != ""
                              ? [...apiResponse].sort((a, b) =>
                                  currentSortOrder.sort == "desc"
                                    ? b[currentSortOrder.name].localeCompare(
                                        a[currentSortOrder.name]
                                      )
                                    : a[currentSortOrder.name].localeCompare(
                                        b[currentSortOrder.name]
                                      )
                                )
                              : apiResponse
                          );
                        }
                      }}
                    >
                      <Box
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {" "}
                        {item.headerName}
                      </Box>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredApiResponse.slice(startIndex, endIndex).map((item) => (
                  <>
                    <tr>
                      {colDefs.map((col) => {
                        return (
                          <AddTableData
                            column={col}
                            item={item}
                            setApiResponse={setApiResponse}
                            apiResponse={apiResponse}
                            setFilteredApiResponse={setFilteredApiResponse}
                          />
                        );
                      })}
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
            <Pagination
              recordsCount={filteredApiResponse.length}
              startIndex={startIndex}
              setStartIndex={setStartIndex}
              endIndex={endIndex}
              setEndIndex={setEndIndex}
            ></Pagination>
          </Box>
        </Grid>
      )}
    </>
  );
};

export default ShowForm;
