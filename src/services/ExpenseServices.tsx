import { handleError } from "../helpers/ErrorHandler";
import { ExpenseCreate } from "../types/Expense";
import apiClient from "./ApiClient";

export const createExpenseAPI = async (
  billId: number,
  expense: ExpenseCreate,
) => {
  try {
    const { data } = await apiClient.post(
      `/api/bill/${billId}/expense/create`,
      expense,
    );
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const getExpenseAPI = async (billId: number, expenseId: number) => {
  try {
    const { data } = await apiClient.get(
      `/api/bill/${billId}/expenses/${expenseId}`,
    );
    return data.expense;
  } catch (error) {
    handleError(error);
  }
};

export const deleteExpenseAPI = async (expenseId: number) => {
  try {
    const { data } = await apiClient.delete(`/api/bill/expense/${expenseId}`);
    return data;
  } catch (error) {
    handleError(error);
  }
};
