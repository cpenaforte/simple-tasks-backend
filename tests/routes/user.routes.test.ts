import request from 'supertest';

import app from '../../src/app';
import {
    createReceivedSampleUser, sampleUser, sampleAllUsers, updateReceivedSampleUser, updatedSampleUser,
} from '../fixtures/user.fixtures';

import migrate from '../../src/migrations/index';

beforeAll(async() => {
    await migrate();
});

describe('User routes', () => {
    let token = '';

    beforeAll(async () => {
        const response = await request(app).post('/auth/login').send({
            email: 'test@simpletasks.com.br', password: '123456',
        }).timeout(10000);

        expect(response.status).toEqual(200);

        console.log('token', response.body.token);

        // eslint-disable-next-line prefer-destructuring
        token = response.body.token;
    });

    test('Create an user', async () => {
        const res = await request(app).post('/api/v1/users').send({ user: createReceivedSampleUser });

        expect(res.status).toEqual(201);
    });

    test('Get all users', async () => {
        const res = await request(app).get('/api/v1/users').set('token', token);
        expect(res.body.users).toEqual(sampleAllUsers);
    });

    test('Get user by id', async () => {
        const res = await request(app).get('/api/v1/users/2').set('token', token);
        expect(res.body.user).toEqual(sampleUser);
    });

    test('Update user', async () => {
        const res = await request(app).put('/api/v1/users/2').set('token', token).send({ user: updateReceivedSampleUser });
        expect(res.body.user).toEqual(updatedSampleUser);
    });

    test('Delete user', async () => {
        const res = await request(app).delete('/api/v1/users/2').set('token', token);
        expect(res.status).toEqual(202);
    });
});