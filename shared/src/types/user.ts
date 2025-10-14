export type Session = string;

export interface User {
    id: number;
    email: string;
    passwordHash: string;
    name: string;
    sessions?: Session[];
};