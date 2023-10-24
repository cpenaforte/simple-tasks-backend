import request from 'supertest';

import app from '../src/app';
import i18next from 'i18next';

describe('Test app.ts', () => {
    test('Catch-all route', async () => {
        const res = await request(app).get('/');
        expect(res.body).toEqual({ info: i18next.t('INFO') });
    });
});