const request = require('supertest');
const app = require('./app');

describe('Statistical Operations API', () => {
    test('/mean with valid numbers', async () => {
        const res = await request(app).get('/mean?nums=1,2,3,4,5');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ operation: 'mean', value: 3 });
    });

    test('/median with valid numbers', async () => {
        const res = await request(app).get('/median?nums=1,2,3,4,5');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ operation: 'median', value: 3 });
    });

    test('/mode with valid numbers', async () => {
        const res = await request(app).get('/mode?nums=1,2,2,3,4');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ operation: 'mode', value: 2 });
    });

    test('/mean with invalid number', async () => {
        const res = await request(app).get('/mean?nums=foo,2,3');
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: 'Invalid number: foo' });
    });

    test('/mean without nums', async () => {
        const res = await request(app).get('/mean');
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: 'nums are required' });
    });
});
