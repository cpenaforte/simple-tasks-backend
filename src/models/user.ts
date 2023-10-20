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
    full_name: string;
    email: string;
    sex: string;
    birthday: string;
}

const enum Gender {
    MALE = 'male',
    FEMALE = 'female',
}