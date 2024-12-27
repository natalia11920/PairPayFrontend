import { handleError } from "../helpers/ErrorHandler";
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
