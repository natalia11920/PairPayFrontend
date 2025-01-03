import { select } from "@nextui-org/react";
import { handleError } from "../helpers/ErrorHandler";
import { BillCreate, BillDetails, BillDisplay } from "../types/Bill";
import apiClient from "./ApiClient";

export const getBillsCreatedAPI = async (
  page: number = 1,
  perPage: number = 4,
  sortBy: string = "created_at",
  sortOrder: string = "desc"
): Promise<{
  bills: BillDisplay[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}> => {
  try {
    const { data } = await apiClient.get("/api/bills/created", {
      params: { page, perPage, sortBy, sortOrder },
    });
    console.log(data);

    return {
      bills: data.bills as BillDisplay[],
      totalItems: data.total_items,
      currentPage: data.current_page,
      totalPages: data.total_pages,
    };
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const getBillsParticipatedAPI = async (
  page: number = 1,
  perPage: number = 5,
  sortBy: string = "created_at",
  sortOrder: string = "desc"
): Promise<{
  bills: BillDisplay[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}> => {
  try {
    const { data } = await apiClient.get("/api/bills/assigned", {
      params: { page, perPage, sortBy, sortOrder },
    });
    console.log(data);

    return {
      bills: data.bills as BillDisplay[],
      totalItems: data.total_items,
      currentPage: data.current_page,
      totalPages: data.total_pages,
    };
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const createBillAPI = async (bill: BillCreate) => {
  try {
    const { data } = await apiClient.post("/api/create-bill", bill);
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteBillAPI = async (billId: number) => {
  try {
    const { data } = await apiClient.delete(`/api/bills/${billId}`);
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const inviteUserToBIllAPI = async () => {};

export const inviteUsersToBillAPI = async (
  billId: number,
  emails: string[]
) => {
  try {
    const { data } = await apiClient.post(`/api/bills/${billId}/invite-users`, {
      user_emails: emails,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const getBillInvitationsAPI = async () => {
  try {
    const { data } = await apiClient.get("api/invitations");
    return data.invitations;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const acceptBillInvitationAPI = async (invitationId: number) => {
  try {
    const { data } = await apiClient.post(
      `/api/invitations/${invitationId}/accept`
    );
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const declineBillInvitationAPI = async (invitationId: number) => {
  try {
    const { data } = await apiClient.post(
      `/api/invitations/${invitationId}/decline`
    );
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const getBillDetailsAPI = async (
  billId: number
): Promise<BillDetails> => {
  try {
    const { data } = await apiClient.get(`/api/bills/${billId}`);
    const bill = data.bill as BillDetails;
    return bill;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const updateBillAPI = async (billId: number, bill: BillCreate) => {
  try {
    const { data } = await apiClient.put(`/api/bills/${billId}`, bill);
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const getFriendsNotInBillAPI = async (billId: number | undefined) => {
  try {
    const { data } = await apiClient.get(
      `api/bills/${billId}/available-friends`
    );
    return data.friends;
  } catch (error) {
    handleError(error);
  }
};

export const getBillParticipantsAPI = async (billId: number | undefined) => {
  try {
    const { data } = await apiClient.get(`/api/bills/${billId}/participants`);
    return data.participants;
  } catch (error) {
    handleError;
  }
};

export const deleteBillParticipantAPI = async (
  billId: number,
  userId: number
) => {
  try {
    const { data } = await apiClient.delete(
      `/api/bills/${billId}/participant/${userId}`
    );
    return data;
  } catch (error) {
    handleError(error);
  }
};
