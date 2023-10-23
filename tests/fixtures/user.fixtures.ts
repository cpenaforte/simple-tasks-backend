import {
    CreateReceivedUser, UpdateReceivedUser, UserToSend,
} from '../../src/models/user';

export const sampleUser: UserToSend = {
    user_id: 2,
    full_name: 'Test',
    email: 'test@test.com',
    sex: 'male',
    birthday: '1990-01-01T00:00:00.000Z',
};

export const sampleAllUsers: UserToSend[] = [ {
    user_id: 1,
    full_name: 'Teste',
    email: 'test@simpletasks.com.br',
    sex: 'male',
    birthday: '1999-08-26T00:00:00.000Z',
}, sampleUser ];

export const updatedSampleUser: UserToSend = {
    user_id: 2,
    full_name: 'Test1',
    email: 'test@test.com',
    sex: 'male',
    birthday: '1990-01-01T00:00:00.000Z',
};

export const createReceivedSampleUser: CreateReceivedUser ={
    full_name: 'Test',
    email: 'test@test.com',
    user_password: 'test',
    confirm_password: 'test',
    sex: 'male',
    birthday: '1990-01-01T00:00:00.000Z',
};

export const updateReceivedSampleUser: UpdateReceivedUser ={
    full_name: 'Test1',
    sex: 'male',
    birthday: '1990-01-01T00:00:00.000Z',
};