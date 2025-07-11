import axios from "axios";
var baseQuery = import.meta.env.VITE_API;

export const deleteCustomer = async (customerId, setApiResponse, setError) => {
  try {
    await axios.delete(baseQuery + "/Customer/DeleteCustomer/" + customerId);
    viewAll(setApiResponse, setError);
  } catch (error) {
    console.log(error);
  }
};

export const viewAll = async (setApiResponse, setError) => {
  try {
    // Replace with your .NET API endpoint
    const response = await axios.get(baseQuery + "/Customer/GetCustomers");
    console.log(response);
    response.data.Result.forEach((element, index) => {
      element["index"] = index + 1;
    });
    setApiResponse(response.data.Result);
    setError(null); // Clear any previous errors
  } catch (err) {
    setError(err.message);
    console.log(err.message);
    setApiResponse(null); // Clear any previous data
  }
};

export const addCustomer = async (request, setApiResponse, setError) => {
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
    viewAll(setApiResponse, setError);
  } catch (error) {
    console.log(error);
  }
};
