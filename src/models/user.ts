export type User = Omit<ReceivedUser, 'confirm_password'> & {
    readonly user_id: number;
    readonly user_password: string;
    sex: Sex;
    birthday: Date;
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

const enum Sex {
    MALE = 'male',
    FEMALE = 'female',
}