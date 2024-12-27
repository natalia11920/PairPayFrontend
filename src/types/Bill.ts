import { ExpenseDisplay } from "./Expense";
import { User } from "./User";

export type BillDisplay = {
  id: string;
  name: string;
  total_sum: number;
  created_at: string;
};

export type BillDetails = {
  id: string;
  name: string;
  label: string;
  total_sum: number;
  created_at: Date;
  users: User;
  expenses: ExpenseDisplay;
};

export type BillCreate = {
  name: string;
  label: string;
};
