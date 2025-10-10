import { useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Button, Box, Grid, Input } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { addCustomer, deleteCustomer, viewAll } from "./axiosAPI";
import Pagination from "./Pagination";
import "./App.css";

export function AddTableData({ column, item, setApiResponse }) {
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
            setApiResponse((apiResponse) =>
              apiResponse.map((customer) => {
                if (customer.index === item["index"]) {
                  return { ...customer, [fieldName]: e.target.value };
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

const ShowForm = () => {
  const [showGrid, setShowGrid] = useState(false);
  const [apiResponse, setApiResponse] = useState([]);
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
    };

    const handleDelete = async () => {
      let statusCode = await deleteCustomer(item["id"]);
      if (statusCode == 200) {
        notifySuccess();
        setApiResponse(apiResponse.filter((x) => x.id != item["id"]));
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
    { field: "name", headerName: "Name", sortable: false },
    { field: "email", headerName: "Email", sortable: false },
    { field: "address", headerName: "Address", sortable: false },
    {
      field: "contact",
      headerName: "Contact",
      sortable: false,
      minLength: 10,
      maxLength: 10,
    },
    {
      field: "birthDate",
      headerName: "Birth Date",
      sortable: false,
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
    setApiResponse((apiResponse) => [
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
    ]);
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
      setApiResponse((apiResponse) =>
        apiResponse.map((customer) => {
          if (customer.index === index) {
            return { ...customer, id: id, index: "", isUpdated: false };
          } else {
            return customer;
          }
        })
      );
    } else notifyError(id);
  }

  return (
    <>
      <ToastContainer />
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
      <Input></Input>
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
                    <th key={item.field}>
                      <Box
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {" "}
                        {item.headerName}
                        {!item.cellRenderer ? (
                          item.sortable ? (
                            <Button
                              onClick={() => {
                                setApiResponse(
                                  [...apiResponse].sort((a, b) =>
                                    b.name.localeCompare(a.name)
                                  )
                                );
                              }}
                            >
                              <ArrowUpwardIcon width={1}></ArrowUpwardIcon>
                            </Button>
                          ) : (
                            <Button
                              onClick={() => {
                                setApiResponse(
                                  [...apiResponse].sort((a, b) =>
                                    a.name.localeCompare(b.name)
                                  )
                                );
                              }}
                            >
                              <ArrowDownwardIcon width={1}></ArrowDownwardIcon>
                            </Button>
                          )
                        ) : null}
                      </Box>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {apiResponse.slice(startIndex, endIndex).map((item) => (
                  <>
                    <tr>
                      {colDefs.map((col) => {
                        return (
                          <AddTableData
                            column={col}
                            item={item}
                            setApiResponse={setApiResponse}
                          />
                        );
                      })}
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
            <Pagination
              recordsCount={apiResponse.length}
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
