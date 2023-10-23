import { UserToSend } from './user';

export type LoginResponse = {
    token: string;
    user: UserToSend;
}