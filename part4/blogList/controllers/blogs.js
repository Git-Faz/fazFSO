import {Router} from 'express'
import {Blog} from '../models/blog.js'

// Router for handling blog-related routes
const blogsRouter = Router()

blogsRouter.get('/', (req, res) => {
    Blog.find({}).then(blogs => {
        res.json(blogs);
        console.log('Blogs retrieved:', blogs); // Log the retrieved blogs;
    })
})

blogsRouter.post('/', (req,res) =>{
    const blog = new Blog(req.body)

    blog.save().then( result =>{ 
        res.status(201).json(result)
        console.log('Blog saved:', result);
    })
})

export default blogsRouter;