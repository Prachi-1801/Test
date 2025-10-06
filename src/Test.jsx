import { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Button, Box } from "@mui/material";
import { addCustomer, deleteCustomer, viewAll } from "./axiosAPI";
import "./App.css";

export function AddTableData({ column, item, setApiResponse }) {
  const [isInputValid, setIsInputValid] = useState(true);
  // let fieldName = column.field;
  const fieldName = useMemo(() => column.field, [column.field]);
  return (
    <td>
      {"cellRenderer" in column ? (
        column.cellRenderer(item)
      ) : item["index"].toString().startsWith("New_") || item["isUpdated"] ? (
        <input
          type={isValidDate(item[fieldName]) ? "date" : ""}
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
    { field: "name", headerName: "Name" },
    { field: "email", headerName: "Email" },
    { field: "address", headerName: "Address" },
    { field: "contact", headerName: "Contact", minLength: 10, maxLength: 10 },
    { field: "birthDate", headerName: "Birth Date" },
    { field: "nominee", headerName: "Nominee" },
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

  useEffect(() => {
    return console.log("EFFECT: ", apiResponse);
  }, [apiResponse]);

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
    let count = apiResponse[apiResponse.length - 1].index
      .toString()
      .startsWith("New_")
      ? apiResponse[apiResponse.length - 1].index.toString().split("_")[1]
      : apiResponse[apiResponse.length - 1].index;
    let index = "New_" + (Number(count) + 1);
    setApiResponse([
      ...apiResponse,
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
          </div>
        </Box>
      )}
    </>
  );
};

export default ShowForm;

function isValidDate(stringDate) {
  return !isNaN(Date.parse(stringDate));
}
