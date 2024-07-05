export interface Response<T extends object> {
  code: string;
  message: string;
  data: T;
}

export type Gender = "M" | "F" | "U"

export interface SocialMedia {
  id: number;
  platform: string;
  url: string;
}