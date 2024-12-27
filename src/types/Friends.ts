export interface DebtInfo {
  net_debt: number;
  owed_to_friend: number;
  owed_to_user: number;
}

export interface Friend {
  id: number;
  mail: string;
  debt_info: DebtInfo;
}

export interface FriendsResponse {
  friends: Friend[];
}
