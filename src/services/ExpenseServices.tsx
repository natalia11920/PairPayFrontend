import { ExpenseCreate } from "../types/Expense";
import apiClient from "./ApiClient";

export const createExpenseAPI = async (
  billId: number,
  expense: ExpenseCreate
) => {
  try {
    const { data } = await apiClient.post(
      `/api/bill/${billId}/expense/create`,
      expense
    );
    return data;
  } catch (error) {
    throw error;
  }
};
