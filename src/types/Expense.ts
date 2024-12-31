import { User } from "./User";

export type ExpenseDisplay = {
  name: string;
  currency: string;
  price: number;
  payer: User;
};

export type ExpenseCreate = {
  name: string;
  price: number;
  currency: string;
  payer: number;
  participants: number[];
};
