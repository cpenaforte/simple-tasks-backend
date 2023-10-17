export type User = Omit<CreateReceivedUser, 'confirm_password'> & {
    readonly user_id: number;
    readonly user_password: string;
    sex: Gender;
    birthday: Date;
}

export type UserToSend = UpdateReceivedUser & {
    user_id: number;
}

export type CreateReceivedUser = {
    username: string;
    user_password: string;
    full_name: string;
    email: string;
    sex: string;
    birthday: string;
    confirm_password: string;
}

export type DBUser = CreateReceivedUser & {
    readonly user_id: number;
}

export type UpdateReceivedUser = {
    username: string;
    full_name: string;
    email: string;
    sex: string;
    birthday: string;
}

const enum Gender {
    MALE = 'male',
    FEMALE = 'female',
}