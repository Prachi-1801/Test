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
    nominee: "",
  };

  const EditCellRenderer = (item) => {
    if (
      (isNewRow.find((x) => x.index == item["index"])?.newRow &&
        item["id"] == "") ||
      isUpdated.find((x) => x.index == item["index"])?.edit
    )
      return <button onClick={() => saveCustomer(item["index"])}>Save</button>;
    return (
      <button
        onClick={() => {
          setIsUpdated([...isUpdated, { index: item["index"], edit: true }]);
        }}
      >
        Edit
      </button>
    );
  };

  const DeleteCellRenderer = (item) => {
    if (
      (isNewRow.find((x) => x.index == item["index"])?.newRow &&
        item["id"] == "") ||
      isUpdated.find((x) => x.index == item["index"])?.edit
    )
      return (
        <button
          onClick={() => {
            if (isNewRow.find((x) => x.index == item["index"])?.newRow)
              setApiResponse(
                apiResponse.filter((x) => x.index != item["index"])
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
      );
    return (
      <button
        onClick={async () => {
          let statusCode = await deleteCustomer(item["id"]).then((result) => {
            return result;
          });
          if (statusCode == 200) {
            setApiResponse(apiResponse.filter((x) => x.id != item["id"]));
          }
        }}
      >
        Delete
      </button>
    );
  };

  const [showGrid, setShowGrid] = useState(false);
  const [apiResponse, setApiResponse] = useState([]);
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
      cellRenderer: EditCellRenderer,
      // cellRendererParams: {
      //   customFunc: setRequest,
      // },
    },
    {
      field: "delete",
      headerName: "Delete",
      cellRenderer: DeleteCellRenderer,
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

  function addTableData(item, column) {
    let fieldName = column.field;
    return (
      <td>
        {"cellRenderer" in column ? (
          column.cellRenderer(item)
        ) : (isNewRow.find((x) => x.index == item["index"])?.newRow &&
            item["index"].toString().startsWith("New_")) ||
          isUpdated.find((x) => x.index == item["index"])?.edit ? (
          <input
            value={item[fieldName]}
            onChange={(e) => {
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

  // useEffect(() => {
  //   return console.log("EFFECT: ", apiResponse);
  // }, [apiResponse]);

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
    setIsNewRow(isNewRow.filter((x) => x.index != index));
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
                  <>
                    <tr>
                      {colDefs.map((col) => {
                        return addTableData(item, col);
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
}
