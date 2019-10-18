const request = require('supertest');
const app = require('./app');

describe('GET /', () => {
    it('responds with text', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Hello 🌎!');
    });
});

describe('Requesting non-existent pages', () => {
    it('respones with 404 error', async () => {
        const res = await request(app).get('/non-existent-page');
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Not found: /non-existent-page');
    });
});
