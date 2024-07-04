export interface Login {
  token: string;
  refreshToken: string;
}

export interface Me {
  id: string;
  email: string;
  role: string;
}
