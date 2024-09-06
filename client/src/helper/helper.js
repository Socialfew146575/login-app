import axios from "axios";

import { jwtDecode } from "jwt-decode";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

// Make API request

export async function authenticate(username) {
  try {
    return await axios.post("/api/authenticate", { username });
  } catch (error) {
    return { error: "Username doesn't exist" };
  }
}

// get username from token

export async function getUsername() {
  const token = localStorage.getItem("token");

  if (!token) Promise.reject("Cannot find token");

  let decode = jwtDecode(token);

  return decode;
}

// get user details

export async function getUser({ username }) {
  try {
    const { data } = await axios.get(`/api/user/${username}`);

    return data;
  } catch (error) {
    return { error: "Password doesn't match" };
  }
}

// /register user function

export async function registerUser(credentials) {
  try {
    const {
      data: { message },
      status,
    } = await axios.post("/api/register", credentials);

    let { username, email } = credentials;

    // send email

    if (status === 201) {
      await axios.post("api/registerMail", {
        username,
        userEmail: email,
        text: message,
      });
    }

    return Promise.resolve(message);
  } catch (error) {
    return Promise.reject({ error });
  }
}

// login function

export async function verifyPassword({ username, password }) {
  if (!username) {
    return Promise.reject({ error: "Username is required" });
  }



  try {
    const response = await axios.post("/api/login", { username, password });

  
   

    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject({ error: "Password doesn't match" });
  }
}

// Update User function

export async function updateUser(response) {
  try {
    const token = await localStorage.getItem("token");

    console.log("Helper starting", token, response);

    const data = await axios.put("/api/updateUser", response, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(data, "Helper ending");

    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't Update Profile..." });
  }
}

// generate OTP

export async function generateOTP(username) {
  try {
    const response = await axios.get("/api/generateOTP", {
      params: { username },
    });

    if (response.status === 201) {
      let data = await getUser({username});
      

      let text = `Your Password Recovery OTP is ${response.data.code}. Verify and recover your password. `;

      await axios.post("api/registerMail", {
        username,
        userEmail: data.user.email,
        text: text,
        subject:"Password Recovery OTP"
      });
    }

    return response.data.code;
  } catch (error) {
    throw new Error(error);
  }
}

// verify OTP

export async function verifyOTP(username, code) {
  try {
    const response = await axios.get("/api/verifyOTP", {
      params: { username, code },
    });

    return response;
  } catch (error) {
    throw new Error(error);
  }
}

// reset password

export async function resetPassword({ username, password }) {
  try {
    const response = await axios.put("/api/resetPassword", {
      username,
      password,
    });

   

    return response;
  } catch (error) {
    throw new Error(error);
  }
}



