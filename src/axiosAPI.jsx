import axios from "axios";
var baseQuery = import.meta.env.VITE_API;

export const deleteCustomer = async (customerId) => {
  try {
    let response = await axios.delete(
      baseQuery + "/Customer/DeleteCustomer/" + customerId
    );
    return response.data.StatusCode;
    // viewAll(setApiResponse, setError);
  } catch (error) {
    console.log(error);
  }
};

export const viewAll = async (setApiResponse, setError) => {
  try {
    // Replace with your .NET API endpoint
    const response = await axios.get(baseQuery + "/Customer/GetCustomers");
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

// export const addCustomer = async (request, setApiResponse, setError) => {
//   console.log(request);
//   try {
//     await axios.post(baseQuery + "/Customer/Register", {
//       id: request.id,
//       name: request.name,
//       email: request.email,
//       password: request.password,
//       address: request.address,
//       contact: request.contact,
//       birthDate: new Date(request.birthDate),
//       nominee: request.nominee,
//     });
//     viewAll(setApiResponse, setError);
//   } catch (error) {
//     console.log(error);
//   }
// };

export const addCustomer = async (request) => {
  console.log(request);
  try {
    let response = await axios.post(baseQuery + "/Customer/Register", {
      id: request.id,
      name: request.name,
      email: request.email,
      password: request.password,
      address: request.address,
      contact: request.contact,
      birthDate: new Date(request.birthDate),
      nominee: request.nominee,
    });
    console.log(await response.data.Result);
    return await response.data.Result;
  } catch (error) {
    console.log(error);
  }
};
