import migrate from '../src/migrations/index';

beforeAll(async() => {
    await migrate();
});

describe('Server.ts tests', () => {
    test('Math test', () => {
        expect(2 + 2).toBe(4);
    });
});