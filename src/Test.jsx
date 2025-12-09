import { useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Button, Box, Grid, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { addCustomer, deleteCustomer, viewAll } from "./axiosAPI";
import Pagination from "./Pagination";
import "./App.css";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import CustomizedMenus from "./DownloadButton";
import generatePdf, { getDocDefinition } from "./DownloadPdf";

function AddTableData({
  column,
  item,
  setApiResponse,
  apiResponse,
  setFilteredApiResponse,
}) {
  const [isInputValid, setIsInputValid] = useState(true);
  const fieldName = useMemo(() => column.field, [column.field]);

  function handleInput(e) {
    setIsInputValid(
      "maxLength" in column ? e.target.value.length == column.maxLength : true
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
  }

  return (
    <td style={{ padding: "10px" }}>
      {column?.cellRenderer ? (
        column.cellRenderer(item)
      ) : item["index"].toString().startsWith("New_") || item["isUpdated"] ? (
        <input
          type={column.isDate ? "date" : ""}
          maxLength={column.maxLength}
          value={item[fieldName]}
          className={isInputValid ? "" : "invalid-input"}
          onChange={(e) => {
            handleInput(e);
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
  const [selectedCount, setSelectedCount] = useState(2);
  const [fileUrl, setFileUrl] = useState(null);

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

  const downloadCellRenderer = (item) => {
    console.log(item);
    return (
      <>
        <button
          onClick={() => {
            const docDefinition = getDocDefinition(item);
            const pdf = generatePdf(docDefinition);
            pdf.getDataUrl((url) => {
              setFileUrl(url);
            });
          }}
        >
          Download
        </button>
      </>
    );
  };

  const deleteCellRenderer = (item) => {
    const handleCancel = () => {
      let newApiResponse = "";
      if (item["index"].toString().startsWith("New_")) {
        newApiResponse = apiResponse.filter((x) => x.index != item["index"]);
        setApiResponse(newApiResponse);
      }
      newApiResponse = apiResponse.map((customer) => {
        if (customer.index === item["index"]) {
          return { ...customer, isUpdated: false };
        } else {
          return customer;
        }
      });
      setApiResponse(newApiResponse);
      setFilteredApiResponse(newApiResponse);
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
    {
      field: "download",
      headerName: "Download",
      cellRenderer: downloadCellRenderer,
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
    let indexCount = 1;
    let index = "New_" + indexCount;
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
        indexCount++;
        if (customer.index.toString().includes("New_")) {
          return { ...customer, index: "New_" + indexCount };
        }
        return { ...customer, index: indexCount };
      }),
    ];
    setApiResponse(newApiResponse);
    setFilteredApiResponse(newApiResponse);
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

  function sorting(item) {
    if (item.sortable) {
      let currentSortOrder = { name: "", sort: "" };
      if (sortOrder.sort == "" || sortOrder.name != item.field) {
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
  }

  return (
    <>
      <ToastContainer />
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        height={"100vh"}
      >
        <Box
          display={"flex"}
          justifyContent={"center"}
          gap={"10px"}
          paddingTop={10}
        >
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
          <CustomizedMenus
            showGrid={!showGrid}
            setFileUrl={setFileUrl}
            data={apiResponse}
          />
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
        <Box
          display={"flex"}
          alignItems={"center"}
          flexGrow={1}
          flexDirection={"column"}
        >
          {showGrid && (
            <Grid container justifyContent="center">
              <Box
                sx={{
                  margin: 5,
                  border: "1px solid black",
                  padding: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <table id="customerTable">
                  <thead>
                    <tr>
                      {colDefs.map((item) => (
                        <th
                          key={item.field}
                          onClick={() => {
                            sorting(item);
                          }}
                          style={{ paddingRight: 10 }}
                        >
                          <Box
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {item.headerName}{" "}
                            {sortOrder.name == item.field ? (
                              sortOrder.sort == "asc" ? (
                                <ArrowUpward />
                              ) : sortOrder.sort == "desc" ? (
                                <ArrowDownward />
                              ) : (
                                ""
                              )
                            ) : (
                              ""
                            )}
                          </Box>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApiResponse
                      .slice(startIndex, endIndex)
                      .map((item) => (
                        <>
                          <tr>
                            {colDefs.map((col) => {
                              return (
                                <AddTableData
                                  column={col}
                                  item={item}
                                  setApiResponse={setApiResponse}
                                  apiResponse={apiResponse}
                                  setFilteredApiResponse={
                                    setFilteredApiResponse
                                  }
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
                  selectedCount={selectedCount}
                  setSelectedCount={setSelectedCount} 
                ></Pagination>
              </Box>
            </Grid>
          )}
          <iframe
            src={fileUrl}
            style={{
              width: "500px",
              height: "500px",
              border: "none",
              overflow: "hidden",
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default ShowForm;
