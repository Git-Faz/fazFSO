import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

const loginRouter = Router();

loginRouter.post('/', async (req,res) => {
    const {username, password} = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(400).json({
            error: 'invalid username or password'
        });
    }

    const passwordCorrect = user === null
    ? false 
    : bcrypt.compare(password, user.passwordHash)

    if (!passwordCorrect) {
        return res.status(401).json({
            error: "Wrong password, try again!!"
        })
    }

    const userForToken = {
        username: user.username, id: user._id
    }

    const token = jwt.sign(userForToken,process.env.JWT_SECRET)

    res.status(200).send({
        token, 
        username: user.username,
        name: user.name
    })
}) //works fine

export default loginRouter
