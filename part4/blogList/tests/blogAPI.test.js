import { beforeEach, after, describe, test } from "node:test";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import { Blog } from "../models/blog.js";
import {
  blogsList,
  singleBlog,
  invalidBlog,
  noLikesBlog,
} from "./test_helper.js";
import assert, { strictEqual } from "assert";

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(blogsList);
});

describe("Blog API Tests", () => {
  test("should return all blogs in JSON:", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("unique identifier is named id", async () => {
    const currentBlogs = await api.get("/api/blogs");
    const blogs = currentBlogs.body[0];
    const keys = Object.keys(blogs);
    //console.log(`Keys in the first blog: ${keys}`);
    assert(keys.includes("id"));
    strictEqual(keys.includes("_id"), false);
  });

  test("Add a specific blog", async () => {
    await api
      .post("/api/blogs")
      .send(singleBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    await api
      .get("/api/blogs")
      .expect(200)
      .expect((res) => {
        const updatedBlogs = res.body;
        //console.log(`Blogs in the response: ${JSON.stringify(blogs, null, 2)}`);

        assert(updatedBlogs.length === blogsList.length + 1);
        assert(updatedBlogs.some((blog) => blog.title === singleBlog.title));
      })
      .expect("Content-Type", /application\/json/);
  });

  test("a blog without likes, defaults to 0", async () => {
    await api
      .post("/api/blogs")
      .send(noLikesBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const updatedBlogs = await api.get("/api/blogs");
    const addedBlog = updatedBlogs.body.find((blog) => blog.title === noLikesBlog.title);

    assert(addedBlog.likes === 0);
    strictEqual(addedBlog.likes, 0);
  });

  test("a blog without title or url returns 400", async () => {
    await api
      .post("/api/blogs")
      .send(invalidBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
});

describe('deletion of blogs', () => {
  test('should delete a blog by id', async () => {
    const currentBlogs = await api.get('/api/blogs');
    console.log('blogs before deletion:');
    for (const blog of currentBlogs.body) {
      console.log(`- ${blog.title}`);
    }
    await api
      .delete(`/api/blogs/${currentBlogs.body[0].id}`)
      .expect(204);
    console.log(`\nDeleted blog : ${currentBlogs.body[0].title}`);

    const updatedBlogs = await api.get('/api/blogs');
    console.log('blogs after deletion:');
    for (const blog of updatedBlogs.body) {
      console.log(`- ${blog.title}`);
    }

    assert(updatedBlogs.body.length === currentBlogs.body.length - 1);
    assert(!updatedBlogs.body.some((blog) => blog.id === currentBlogs.body[0].id));
  });
});

describe('updation of blogs', () => {
  test('should update a blog by id', async () => {
    const currentBlogs = await api.get('/api/blogs');
    const blogToUpdate = currentBlogs.body[0];
    console.log(`Updating the blog: '${blogToUpdate.title}' which has ${blogToUpdate.likes} likes`);
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: 100 })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const updatedBlogs = await api.get('/api/blogs');
    const updatedBlog = updatedBlogs.body.find((blog) => blog.id === blogToUpdate.id);
    console.log(`Updated the blog: '${blogToUpdate.title}' to ${updatedBlog.likes} likes`);
    assert(updatedBlog.likes === 100);
    //assert(updatedBlog.author === 'Updated Author');
  });
});

after(async () => {
    await mongoose.connection.close();
  });