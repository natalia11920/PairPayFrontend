import { ExpenseDisplay } from "./Expense";
import { User } from "./User";

export type BillDisplay = {
  id: number;
  name: string;
  total_sum: number;
  created_at: string;
};

export type BillDetails = {
  id: number;
  name: string;
  label: string;
  total_sum: number;
  created_at: Date;
  users: User[];
  expenses: ExpenseDisplay[];
};

export type BillCreate = {
  name: string;
  label: string;
};
