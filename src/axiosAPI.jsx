import axios from "axios";

var baseQuery = import.meta.env.VITE_API;

export const deleteCustomer = async (customerId) => {
  try {
    let response = await axios.delete(
      baseQuery + "/Customer/DeleteCustomer/" + customerId
    );
    return response.data.StatusCode;
  } catch (error) {
    return error.response.data.StatusMessage;
  }
};
export const viewAll = async (setApiResponse, setError) => {
  try {
    // Replace with your .NET API endpoint
    const response = await axios.get(baseQuery + "/Customer/GetCustomers");
    response.data.Result.forEach((element, index) => {
      element["index"] = index + 1;
      element["birthDate"] = new Date(element["birthDate"])
        .toISOString()
        .split("T")[0];
    });
    setApiResponse(response.data.Result);
    setError(null); // Clear any previous errors
  } catch (error) {
    setError(error.message);
    setApiResponse(null); // Clear any previous data
    return error.response.data.StatusMessage;
  }
};

export const addCustomer = async (request) => {
  try {
    let response = await axios.post(baseQuery + "/Customer/Register", {
      id: request.id,
      name: request.name,
      email: request.email,
      password: request.password,
      address: request.address,
      contact: request.contact,
      birthDate: new Date(request.birthDate).toISOString().split("T")[0],
      nominee: request.nominee,
    });
    return await response.data.Result;
  } catch (error) {
    return error.response.data.StatusMessage;
  }
};
