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

blogsRouter.delete('/:id', async (req,res) => {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
        return res.status(404).json({ error: 'Blog not found' });
    }

    res.status(204).end();
    //console.log(`Blog with ID ${id} deleted`); // Log the deletion
})

blogsRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedBlog = await Blog
        .findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedBlog) {
        return res.status(404).json({ error: 'Blog not found' });
    }

    res.json(updatedBlog);
    //console.log(`Blog with ID ${id} updated:`, updatedBlog);
})

export default blogsRouter;