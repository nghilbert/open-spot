export type Session = string;
export type Role = string;

import type {Password} from "./password"; // adjust import paths as needed

export interface User {
  id: number;
  username: string;
  email: string;
  emailVerified: boolean;
  password?: Password;
  PasswordID: string;
  oldPasswords?: Password[];
  name: string;
  sessions?: Session[];
  role: Role;
  createdOn: Date;
}