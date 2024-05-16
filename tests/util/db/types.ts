export interface Page {
  id: number;
  url: string;
  title: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  created_at: string;
  role: string;
}
