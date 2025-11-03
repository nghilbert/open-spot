export type Session = string;
export type Role = string;

import type {Password} from "./password"; // adjust import paths as needed
import type { OAuth } from "./oauth";

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
  oauths?: OAuth[];
  role: Role;
  createdOn: Date;
}