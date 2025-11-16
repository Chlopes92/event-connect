import { Role } from "./Role";


export interface Profile {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone: string;
  organization?: string;
  role?: Role;
}

export interface ProfileLogin {
  email: string;
  password: string;
}