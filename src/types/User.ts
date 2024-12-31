import { Key } from "react";

export type UserToken = {
  user: User;
  access_token: string;
  refresh_token: string;
};

export type User = {
  id: number;
  name: string;
  surname: string;
  mail: string;
  admin: boolean;
};
