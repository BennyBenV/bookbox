const User = require("../models/User");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

exports.getMe = async (req,res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
}

exports.updateProfile = async (req,res) => {
    try{
        const { username, password, avatar } = req.body;

        const updatedFields = {};
        if (username){ 
            const existingUser = await User.findOne({username});
            if(existingUser && existingUser._id.toString() !== req.user.id){
                return res.status(400).json({message: "Ce pseudo est déjà utilisé"});
            }
            updatedFields.username = username;

        }
        if (avatar) updatedFields.avatar = avatar;
        if (password) {
            const hashed = await bcrypt.hash(password, 10);
            updatedFields.password = hashed;
        }

        const userUpdated = await User.findByIdAndUpdate(req.user.id, updatedFields, {new: true, runValidators: true}).select("-password");
        res.json({user: userUpdated});
    }catch(err){
        if (err.code === 11000 && err.keyPattern?.username) {
            return res.status(400).json({ message: "Ce pseudo est déjà utilisé" });
        }      
        console.error("Erreur update profile:", err );
        res.status(500).json({message: "Erreur interne serveur"});
    }
}

exports.deleteAccount = async (req,res) => {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Compte supprimé"});
}

exports.uploadAvatar = async (req,res) => {
    try{
        if(!req.file) return res.status(400).json({message: "Aucun fichier reçu"});
        
        const fileName = req.file.filename;
        const url = `/uploads/avatars/${fileName}`;

        await User.findByIdAndUpdate(req.user.id, {avatar: url});

        res.json({url});
    }catch(err) {
        console.error("Erreur upload avatar : ", err);
        res.status(500).json({ message: "Erreur lors de l'upload de l'image"});
    }
}