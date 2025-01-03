import { handleError } from "../helpers/ErrorHandler";
import { Friend } from "../types/Friends";
import { User } from "../types/User";
import apiClient from "./ApiClient";

export const getUsersEmailsAPI = async (): Promise<string[]> => {
  try {
    const { data } = await apiClient.get<string[]>(
      "/api/user/get_users_emails",
    );
    return data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const getUserInfoByEmailAPI = async (email: string): Promise<Friend> => {
  try {
    const { data } = await apiClient.get(
      `/api/user/get_user_by_email/${email}`,
    );
    return data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const getFriendListAPI = async () => {
  try {
    const { data } = await apiClient.get("/api/friends");
    return data.friends;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const getUserInfoAPI = async (): Promise<{
  user: User[];
  id: number;
  name: string;
  surname: string;
  mail: string;
  admin: boolean;
}> => {
  try {
    const response = await apiClient.get("/api/current_user");
    console.log(response.data);

    return {
      user: response.data.user as User[],
      id: response.data.id,
      name: response.data.name,
      surname: response.data.surname,
      mail: response.data.mail,
      admin: response.data.admin,
    };
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const deleteUser = async (): Promise<void> => {
  try {
    const delResp = await apiClient.delete("/api/user/del_user");
    console.log("User deleted successfully:", delResp.data);
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const updateUser = async (
  updatedUserData: Partial<User>,
): Promise<void> => {
  try {
    const updateResp = await apiClient.post(
      "/api/user/update",
      updatedUserData,
    );
    console.log("User updated successfully:", updateResp.data);
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const updateUsersByAdmin = async (
  updateUserData: Partial<User>,
): Promise<void> => {
  try {
    const response = await apiClient.post(
      "/api/user/admin/update",
      updateUserData,
    );

    console.log("User updated successfully:", response.data);
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const makeAdmin = async (UserData: Partial<User>): Promise<void> => {
  try {
    const assignAdminResp = await apiClient.post(
      "/api/user/admin/make_admin",
      UserData,
    );
    console.log("New admin role assigned:", assignAdminResp.data);
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const getUsers = async (
  email: string,
): Promise<{
  user: User[];
  id: number;
  name: string;
  surname: string;
  mail: string;
  admin: boolean;
}> => {
  try {
    const response = await apiClient.post("/api/user/search", { mail: email });
    console.log(response.data);

    return {
      user: response.data.user as User[],
      id: response.data.id,
      name: response.data.name,
      surname: response.data.surname,
      mail: response.data.mail,
      admin: response.data.admin,
    };
  } catch (error) {
    handleError(error);
    throw error;
  }
};
