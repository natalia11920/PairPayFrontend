import { createContext, useEffect, useState } from "react";
import { User } from "../types/User";
import { useNavigate } from "react-router-dom";
import { loginAPI, logoutAPI, registerAPI } from "../services/AuthServices";
import { toast } from "react-toastify";
import React from "react";
import axios from "axios";

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  registerUser: (
    name: string,
    surname: string,
    email: string,
    password: string,
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
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (storedUser && storedAccessToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${storedAccessToken}`;
    }
    setIsReady(true);
  }, []);

  const registerUser = async (
    name: string,
    surname: string,
    email: string,
    password: string,
  ) => {
    try {
      const response = await registerAPI(name, surname, email, password);

      if (response) {
        console.log("Registration successful", response.data);
        // toast.success("Registration Success");
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
          const userObj = {
            id: response.data.user.id,
            name: response.data.user.name,
            surname: response.data.user.surname,
            mail: response.data.user.mail,
            admin: response.data.user.admin,
          };

          localStorage.setItem("user", JSON.stringify(userObj));
          localStorage.setItem("accessToken", response.data.access_token);
          localStorage.setItem("refreshToken", response.data.refresh_token);

          setAccessToken(response.data.access_token);
          setRefreshToken(response.data.refresh_token);
          setUser(userObj);

          axios.defaults.headers.common["Authorization"] =
            `Bearer ${response.data.access_token}`;

          toast.success("Login Success");
          navigate("/home");
        }
      })
      .catch((e) => toast.warning("Server error occurred"));
  };

  const isLoggedIn = () => {
    return !!accessToken;
  };

  const logout = async () => {
    await logoutAPI();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        loginUser,
        user,
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
