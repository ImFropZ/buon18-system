export interface Login {
  token: string;
  refresh_token: string;
}

export interface Me {
  id: string;
  email: string;
  role: string;
}
