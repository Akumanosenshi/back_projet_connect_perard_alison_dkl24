const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const userController = require('../controllers/UserController');

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

// Créer une application Express pour tester
const app = express();
app.use(express.json());
app.post('/users', userController.createUser);
app.get('/users', userController.getUsers);

// Connexion à la base de données MongoDB distante
beforeAll(async () => {
    const url = process.env.MONGO_URI;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
}, 20000);  // Augmentation du délai d'attente à 20 secondes

afterAll(async () => {
    await mongoose.connection.close();
});

function generateRandomEmail() {
    const randomString = Math.random().toString(36).substring(2, 10); // Génère une chaîne aléatoire
    return `test_${randomString}@example.com`;
}

describe('UserController Tests', () => {

    it('should create a new user', async () => {
        const userData = {
            firstName: 'Johnny',
            lastName: 'Doe',
            email: generateRandomEmail(),  // Utilise l'email aléatoire généré
            birthDate: '10-10-1900',
            city: 'Salon',
            postalCode: '13300'
        };

        const response = await request(app)
            .post('/users')
            .send(userData);

        console.log(response.body)

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('_id'); // Vérifie que l'utilisateur créé a un ID
        expect(response.body.firstName).toBe(userData.firstName);
        expect(response.body.lastName).toBe(userData.lastName);
        expect(response.body.email).toBe(userData.email);
        expect(new Date(response.body.birthDate).toISOString()).toBe(new Date(userData.birthDate).toISOString());
        expect(response.body.city).toBe(userData.city);
        expect(response.body.postalCode).toBe(userData.postalCode);
    });

    it('should get all users', async () => {
        const response = await request(app)
            .get('/users');

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
