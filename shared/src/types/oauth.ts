import { User } from "./user";

export interface OAuth {
    user: User;
    oauth: string;
    dateSent: Date;
};