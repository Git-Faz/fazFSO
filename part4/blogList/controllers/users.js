import bcrypt from 'bcrypt';
import { Router } from "express";
import { User } from "../models/user.js";

const usersRouter = Router();

usersRouter.post('/', async (req,res) => {

    const {username, name, password} = req.body

    if(!password || password.length < 3){
        return res.status(400).json({
            error: 'password must be at least 3 charachters long'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password,saltRounds)

    const user = new User({
        username, name, passwordHash
    })

    const savedUser = await user.save()
    console.log(`User created: ${savedUser.username} with ID ${savedUser._id}`);
    res.status(201).json(savedUser)
}) //works fine

usersRouter.get('/',async (req,res) => {
    const users = await User.find({}).populate('blogs',{
        title: 1, url: 1, likes: 1
    })
    res.json(users);
}) //works fine

export default usersRouter;