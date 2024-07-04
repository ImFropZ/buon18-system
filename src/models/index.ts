export interface Response<T extends object> {
  code: string;
  message: string;
  data: T;
}
