import { mongoose } from "mongoose";

// Define the schema for a blog post
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: { type: Number, default: 0 }, // Default likes to 0 if not provided
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const Blog = mongoose.model("Blog", blogSchema);
