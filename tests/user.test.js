const request = require('supertest');
const express = require('express');
const connectDB = require('../db');

const app = express();
app.use(express.json());

let usersCollection;

beforeAll(async () => {
    const db = await connectDB();
    usersCollection = db.collection('users');
    app.get('/api/users', async (req, res) => {
        try {
            const users = await usersCollection.find().toArray();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.post('/api/users', async (req, res) => {
        try {
            const user = req.body;
            await usersCollection.insertOne(user);
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });
});

afterEach(async () => {
    await usersCollection.deleteMany({});
});

describe('User API', () => {
    it('should create a new user', async () => {
        const newUser = { firstName: "John", lastName: "Doe", email: "john@example.com" };
        const res = await request(app).post('/api/users').send(newUser);
        expect(res.statusCode).toEqual(201);
        expect(res.body.firstName).toEqual('John');
    });

    it('should fetch all users', async () => {
        const res = await request(app).get('/api/users');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });
});
