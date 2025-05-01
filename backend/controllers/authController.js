const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    return regex.test(password);
}

exports.register = async (req, res) => {
    const {email, password, username} = req.body;
    try{
        if (!email || !password || !username) {
            return res.status(400).json({message: "All fields are required."});
        }

        if(!validatePassword(password)){
            return res.status(400).json({message: "Password must be at least 8 characters long, include upper and lower case letters, a number and a special character."});
        }

        const existingEmail = await User.findOne({email});
        if (existingEmail){
            return res.status(400).json({message: "Email already in use."});
        }

        const existingUsername = await User.findOne({username});
        if (existingUsername){
            return res.status(400).json({message: "Usernam already taken."});
        }

        const hashedPassword = await bycrypt.hash(password, parseInt(process.env.SALT_ROUNDS || '10'));

        const newUser = await User.create({ email, username, password: hashedPassword});

        const token = jwt.sign(
            { id: newUser._id, username: newUser.username},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        res.status(201).json({token, user: {id: newUser._id, email: newUser.email, username: newUser.username,}})
        
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

        res.json({token, user: {id: user._id, email: user.email, username: user.username}});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
};