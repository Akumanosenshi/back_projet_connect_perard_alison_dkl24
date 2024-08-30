const express = require('express');
const cors = require('cors');  // Importer cors
const connectDB = require('./db');
const User = require('./models/User');

const app = express();

app.use(cors());  // Utiliser cors pour autoriser toutes les origines
app.use(express.json());
connectDB().then(db => {
    const usersCollection = db.collection('users');

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

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(console.error);
