export interface Customer {
  id: number;
  full_name: string;
  gender: string;
  email: string;
  phone: string;
  additional_info: {
    [key: string]: any;
  };
}
