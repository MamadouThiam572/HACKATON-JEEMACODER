import axios from "axios";
const BASE_URL = import.meta.env.VITE_APP_API_URL;

export async function login({ email, password }) {
  try {
    const res = await axios.post(BASE_URL + "/api/auth/login/", {
      email,
      password,
    });

    const token = res.data.token;
    localStorage.setItem("jwt", token); 

    return { status: res.status, data: res.data };
  } catch (err) {
    if (err.response) {
      return { status: err.response.status, data: err.response.data };
    } else {
      return { status: null, data: { error: err.message } };
    }
  }
}

export async function register({ name, email, password, phone }) {
  try {
    const res = await axios.post(BASE_URL + "/api/auth/register/", {
      name: name,
      email: email,
      password: password,
      phone: phone,
    });

    console.log(res.status);
    console.log(res.data);
    return { status: res.status, data: res.data };
  } catch (err) {
    if (err.response) {
      // Server responded with an error status code
      console.log(err.response.status);
      console.log(err.response.data);
      return { status: err.response.status, data: err.response.data };
    } else {
      // Something else went wrong (like network error)
      console.error("Error:", err.message);
      return { status: null, data: { error: err.message } };
    }
  }
}

export function isLoggedIn() {
    const token=localStorage.getItem("jwt")
    if (token){
      return true
    }
    return false   
}

export function logout() {
  localStorage.removeItem("jwt");
}
