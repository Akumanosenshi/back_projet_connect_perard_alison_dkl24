const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await User.deleteMany({});
});

describe('User API', () => {
    it('should create a new user successfully', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                birthDate: '1990-01-01',
                city: 'New York',
                postalCode: '10001',
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.firstName).toBe('John');
    });

    it('should return validation error for invalid data', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                firstName: 'J',
                email: 'invalid-email',
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });
});
