export type User = Omit<ReceivedUser, 'confirm_password'> & {
    readonly user_id: number;
    readonly user_password: string;
    sex: Gender;
    birthday: Date;
}

export type UserToSend = Omit<User, 'user_password'> & {
    birthday: string;
}

export type ReceivedUser = {
    username: string;
    user_password: string;
    full_name: string;
    email: string;
    sex: string;
    birthday: string;
    confirm_password: string;
}

const enum Gender {
    MALE = 'male',
    FEMALE = 'female',
}