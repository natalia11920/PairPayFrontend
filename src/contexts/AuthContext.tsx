import { createContext, useEffect, useState } from "react";
import { User } from "../types/User";
import { useNavigate } from "react-router-dom";
import { loginAPI, registerAPI } from "../services/AuthServices";
import { toast } from "react-toastify";
import React from "react";
import axios from "axios";

type AuthContextType = {
  // user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  registerUser: (
    name: string,
    surname: string,
    email: string,
    password: string
  ) => void;
  loginUser: (email: string, password: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  // const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // const user = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");

    // if (user && accessToken) {
    if (accessToken) {
      // setUser(JSON.parse(user));
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
    }
    setIsReady(true);
  }, []);

  const registerUser = async (
    name: string,
    surname: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await registerAPI(name, surname, email, password);

      if (response) {
        console.log("Registration successful", response.data);
        toast.success("Registration Success");
        return response.data;
      }

      return null;
    } catch (error: any) {
      console.error("Registration failed:", error.message || error);
      return "Registration failed. Please try again.";
    }
  };

  const loginUser = async (email: string, password: string) => {
    await loginAPI(email, password)
      .then((response) => {
        if (response) {
          console.log(response);
          localStorage.setItem("accessToken", response?.data.access_token);
          localStorage.setItem("refreshToken", response?.data.refresh_token);

          // const userObj = {
          //   name: response?.data.name,
          //   surname: response?.data.surname,
          //   email: response?.data.email,
          // };
          setAccessToken(response?.data.access_token);
          setRefreshToken(response?.data.access_token);
          toast.success("Login Success");
        }
      })
      .catch((e) => toast.warning("Server error occured"));
  };

  const isLoggedIn = () => {
    return !!accessToken;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // setUser(null);
    setAccessToken("");
    setRefreshToken("");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        loginUser,
        // user,
        accessToken,
        refreshToken,
        registerUser,
        isLoggedIn,
        logout,
      }}
    >
      {isReady ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
