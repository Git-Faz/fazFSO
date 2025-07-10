import {Router} from 'express'
import {Blog} from '../models/blog.js'

// Router for handling blog-related routes
const blogsRouter = Router()

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({});
    res.json(blogs);
    //console.log('Blogs retrieved:', blogs); // Log the retrieved blogs;
})

blogsRouter.post('/',async (req,res) =>{
    const blog = new Blog(req.body)

    if (!blog.title || !blog.url) {
        return res.status(400).json({ error: 'Title and URL are required' });
    }

    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
    //console.log('Blog saved:', savedBlog); // Log the saved blog title
})

export default blogsRouter;