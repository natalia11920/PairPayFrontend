import { handleError } from "../helpers/ErrorHandler";
import apiClient from "./ApiClient";

export const getPendingRequestsAPI = async () => {
  try {
    const { data } = await apiClient.get("/api/pending_requests");
    return data.pending_requests;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const acceptRequestAPI = async (id: number) => {
  try {
    const { data } = await apiClient.post(`/api/accept_request/${id}`);
    return data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const declineRequestAPI = async (id: number) => {
  try {
    const { data } = await apiClient.post(`/api/decline_request/${id}`);
    return data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const getFriendsAPI = async () => {
  try {
    const { data } = await apiClient.get("/api/friends");
    return data.friends;
  } catch (error) {
    handleError(error);
    throw error;
  }
};
