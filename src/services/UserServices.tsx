import { handleError } from "../helpers/ErrorHandler";
import { Friend } from "../types/Friends";
import apiClient from "./ApiClient";

export const getUsersEmailsAPI = async (): Promise<string[]> => {
  try {
    const { data } = await apiClient.get<string[]>(
      "/api/user/get_users_emails"
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
      `/api/user/get_user_by_email/${email}`
    );
    return data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};
