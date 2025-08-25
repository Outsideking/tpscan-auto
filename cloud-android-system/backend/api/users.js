const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });
    res.json({ success: true, user });
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'User not found' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Wrong password' });
    const token = jwt.sign({ id: user.id, role: user.role }, 'SECRET_KEY', { expiresIn: '2h' });
    res.json({ success: true, token });
});

module.exports = router;
