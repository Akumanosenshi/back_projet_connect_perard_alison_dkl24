require('dotenv').config();  // Charge les variables d'environnement
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('../routes/userRoutes');  // Assurez-vous que ce chemin est correct
const User = require('../models/User');

let app;

beforeAll(async () => {
    // Connecte à MongoDB en utilisant l'URI du fichier .env
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Crée une application express pour les tests
    app = express();
    app.use(express.json());
    app.use('/api/users', userRoutes);  // Monte les routes sur l'application
});

afterAll(async () => {
    await mongoose.disconnect();  // Déconnecte la base de données après tous les tests
});

afterEach(async () => {
    await User.deleteMany({});  // Nettoie la collection des utilisateurs après chaque test
});

describe('User API', () => {
    it('should create a new user', async () => {
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

    it('should fail with invalid data', async () => {
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
