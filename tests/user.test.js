const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('../routes/userRoutes');
const User = require('../models/User');

dotenv.config();

// Setup express app for testing
const app = express();
app.use(express.json());
app.use('/api', userRoutes);

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

afterEach(async () => {
    await User.deleteMany();
});

describe('User API', () => {
    it('should create a new user', async () => {
        const newUser = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            birthDate: '1990-01-01',
            city: 'Paris',
            postalCode: '75000',
        };

        const res = await request(app).post('/api/users').send(newUser);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('firstName', 'John');
    });

    it('should get all users', async () => {
        const users = [
            { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', birthDate: '1990-01-01', city: 'Paris', postalCode: '75000' },
            { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', birthDate: '1992-02-02', city: 'Lyon', postalCode: '69000' },
        ];

        await User.insertMany(users);

        const res = await request(app).get('/api/users');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(2);
    });
});
