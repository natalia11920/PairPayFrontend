import { handleError } from "../helpers/ErrorHandler";
import { BillDisplay } from "../types/Bill";
import apiClient from "./ApiClient";

export const getBillsCreatedAPI = async (
  page: number = 1,
  perPage: number = 4
): Promise<{
  bills: BillDisplay[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}> => {
  try {
    const response = await apiClient.get("/api/bills/created", {
      params: { page, perPage },
    });
    console.log(response.data);

    return {
      bills: response.data.bills as BillDisplay[],
      totalItems: response.data.total_items,
      currentPage: response.data.current_page,
      totalPages: response.data.total_pages,
    };
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const getBillsParticipatedAPI = async (
  page: number = 1,
  perPage: number = 5
): Promise<{
  bills: BillDisplay[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}> => {
  try {
    const response = await apiClient.get("/api/bills/assigned", {
      params: { page, perPage },
    });
    console.log(response.data);

    return {
      bills: response.data.bills as BillDisplay[],
      totalItems: response.data.total_items,
      currentPage: response.data.current_page,
      totalPages: response.data.total_pages,
    };
  } catch (error) {
    handleError(error);
    throw error;
  }
};
