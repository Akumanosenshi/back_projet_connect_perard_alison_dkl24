const User = require('../models/User');

exports.createUser = async (req, res) => {
    console.log("Received a new user submission.");
    console.log("Request Body:", req.body); // Logge les données reçues dans la requête

    try {
        const user = new User(req.body); // Suppose que vous utilisez Mongoose ou une approche similaire
        await user.save();
        console.log("User successfully saved to the database.");
        res.status(201).json(user);
    } catch (err) {
        console.error("Error saving user:", err.message);
        res.status(400).json({ error: err.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
