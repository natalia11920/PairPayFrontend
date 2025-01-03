import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import { UserToken } from "../types/User";
import { toast } from "react-toastify";

const api = "http://localhost:5000/api";

export const loginAPI = async (mail: string, password: string) => {
  try {
    const data = await axios.post<UserToken>(api + "/login", {
      mail: mail,
      password: password,
    });
    return data;
  } catch (error: any) {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        toast.error("Invalid Email or password.");
      } else {
        toast.error("An error occurred while logging in.");
      }
    } else {
      toast.error("Unable to connect to the server.");
    }
    throw error;
  }
};

export const registerAPI = async (
  name: string,
  surname: string,
  mail: string,
  password: string,
) => {
  try {
    const data = await axios.post<UserToken>(api + "/register", {
      name: name,
      surname: surname,
      mail: mail,
      password: password,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const logoutAPI = async () => {
  try {
    await axios.delete(api + "/logout", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  } catch (error) {
    handleError(error);
  }
};
