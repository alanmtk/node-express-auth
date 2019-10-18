const request = require('supertest');
const app = require('./../app');
const db = require('./../db');

const users = db.get('users');

describe('POST /auth/signup', () => {
    beforeAll(() => users.remove());
    afterAll(() => users.remove());

    it('should require username', async () => {
        const res = await request(app).post('/auth/signup');
        expect(res.statusCode).toEqual(422);
        expect(res.body.message).toEqual('"username" is required');
    });
    it('should require username of at least 3 characters long', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({ username: 'te' });
        expect(res.statusCode).toEqual(422);
        expect(res.body.message).toEqual('"username" length must be at least 3 characters long');
    });
    it('should require username of at less than or equal to 30 characters long', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({ username: 'superlongusernamewillfailwhensigninup' });
        expect(res.statusCode).toEqual(422);
        expect(res.body.message).toEqual(
            '"username" length must be less than or equal to 30 characters long'
        );
    });
    it('should require username with alpha-numeric characters ', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({ username: 'testuser?' });
        expect(res.statusCode).toEqual(422);
        expect(res.body.message).toEqual('"username" must only contain alpha-numeric characters');
    });
    it('should require email', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({ username: 'usertest' });
        expect(res.statusCode).toEqual(422);
        expect(res.body.message).toEqual('"email" is required');
    });
    it('should require a valid email', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({ username: 'usertest', email: 'user@tester' });
        expect(res.statusCode).toEqual(422);
        expect(res.body.message).toEqual('"email" must be a valid email');
    });
    it('should require password', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({ username: 'usertest', email: 'user@tester.com' });
        expect(res.statusCode).toEqual(422);
        expect(res.body.message).toEqual('"password" is required');
    });
    it('should require password of at least 8 characters long', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({ username: 'usertest', email: 'user@tester.com', password: '1234567' });
        expect(res.statusCode).toEqual(422);
        expect(res.body.message).toEqual('"password" length must be at least 8 characters long');
    });
    it('should require repeat_password', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({ username: 'usertest', email: 'user@tester.com', password: '12345678' });
        expect(res.statusCode).toEqual(422);
        expect(res.body.message).toEqual('"password" missing required peer "repeat_password"');
    });
    it('should require password and repeat_password to be equal', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({
                username: 'usertest',
                email: 'user@tester.com',
                password: '12345678',
                repeat_password: '12345679'
            });
        expect(res.statusCode).toEqual(422);
        expect(res.body.message).toEqual('"repeat_password" must be [ref:password]');
    });
    it('should create a user', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({
                username: 'usertest',
                email: 'user@tester.com',
                password: '12345678',
                repeat_password: '12345678'
            });
        expect(res.statusCode).toEqual(200);
        expect(await users.count()).toEqual(1);
        users.findOne({ username: 'usertest' }).then(user => {
            expect(user.email).toEqual('user@tester.com');
        });
    });
    it('should not allow a user with an existing username', async () => {
        const user = {
            username: 'usertest',
            email: 'user@tester.com',
            password: '12345678',
            repeat_password: '12345678'
        };
        await request(app)
            .post('/auth/signup')
            .send(user);
        const res = await request(app)
            .post('/auth/signup')
            .send(user);
        expect(res.statusCode).toEqual(409);
        expect(res.body.message).toEqual('That email was taken by another user.');
    });
});
