import { User } from "./User";

export type ExpenseDisplay = {
  id: number;
  name: string;
  currency: string;
  price: number;
  payer: User;
};

export type ExpenseDetails = {
  id: number;
  name: string;
  currency: string;
  price: number;
  payer: User;
  participants: User[];
};

export type ExpenseCreate = {
  name: string;
  price: number;
  currency: string;
  payer: number;
  participants: number[];
};
