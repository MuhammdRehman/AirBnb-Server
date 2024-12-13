import User from "../models/User.js";
import express from "express";
import bcrpt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username, });
        if (existingUser) {
            return res.status(400).send("User Already Exist");
        }
        const hashPassword = await bcrpt.hash(password, 12);
        const user = new User({
            username,
            password: hashPassword,
        });
        console.log("User is going to save");
        await user.save();
        console.log("User saved Successfully");
        res.status(201).json(user);

    } catch (error) {
        res.status(500).json({ error: "Unexpected error occurs" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username, });
        if (!existingUser) {
            return res.status(400).send("User Does Not Exist");
        }

        const IsPasswordCorrect = await bcrpt.compare(password, existingUser.password);
        console.log(IsPasswordCorrect);
        if (!IsPasswordCorrect) {
            return res.status(400).send("Incorrect Password!!!");
        }
        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "6h" });
        res.status(200).json({ user: existingUser, token });

    } catch (error) {
        res.status(500).json({ error: "Unexpected error occurs" });
    }
});

router.get('/me', async (req, res) => {
    try {
        const token = await req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const Expired = Date.now()>=decode.exp * 1000;
        if(Expired){
            return res.status(401).json({error: "Token is Expired" });
        }
        const user = await User.findById(decode.id);
        if (!user) {
            return res.status(404).send("User Not Found");
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send("Something went Wrong");
    }
});



export default router;