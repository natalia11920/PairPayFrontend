import { handleError } from "../helpers/ErrorHandler";
import apiClient from "./ApiClient";

export const getDebtBalancesAPI = async () => {
  try {
    const { data } = await apiClient.get("api/debt/balances");
    return data.balance;
  } catch (error) {
    handleError(error);
  }
};
