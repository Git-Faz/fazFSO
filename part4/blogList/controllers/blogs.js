import { Router } from "express";
import { Blog } from "../models/blog.js";
import { userExtractor } from "../utils/middleware.js";
// Router for handling blog-related routes
const blogsRouter = Router();

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  res.json(blogs);
  //console.log('Blogs retrieved:', blogs); // Log the retrieved blogs;
}); //works fine

blogsRouter.post("/", userExtractor, async (req, res) => {
  const { user } = req;
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const { title, author, url, likes } = req.body;

  if (!title || !url) {
    return res.status(400).json({ error: "Title and URL are required" });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user,
  });

  const savedBlog = await blog.save();
  //console.log(`Blog saved: ${savedBlog.title} by ${savedBlog.author}`);
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
}); //works fine

blogsRouter.delete("/:id", userExtractor, async (req, res) => {
  const { id } = req.params;
  const { user } = req;

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }
  const blog = await Blog.findById(id);

  if (blog.user.toString() !== user._id.toString()) {
    return res
      .status(403)
      .json({ error: "You do not have permission to delete this blog" });
  }
  await Blog.findByIdAndDelete(id);
  res.status(204).end();
}); //works fine

blogsRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, author, url, likes } = req.body;

  const updatedBlog = await Blog
    .findByIdAndUpdate(
        id,
        { title, author, url, likes },
        { new: true }
    )
    .populate("user", {
        username: 1,
        name: 1,
  });

  if (!updatedBlog) {
    return res.status(404).json({ error: "Blog not found" });
  }

  res.json(updatedBlog);
  //console.log(`Blog with ID ${id} updated:`, updatedBlog);
}); //works fine

export default blogsRouter;
