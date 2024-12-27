import { User } from "./User";

export type ExpenseDisplay = {
  name: string;
  currency: string;
  price: number;
  payer: User;
};
