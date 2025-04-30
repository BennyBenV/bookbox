const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    return regex.test(password);
}

exports.register = async (req, res) => {
    const {email, password} = req.body;
    try{
        const exists = await User.findOne({email});
        if (exists) {
            return res.status(400).json({message: "User already exists"});
        }

        const hashed = await bycrypt.hash(password, 10);
        const newUser = await User.create({email, password: hashed});

        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.status(201).json({token});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
};

exports.login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        const match = await bycrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.json({token});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
};