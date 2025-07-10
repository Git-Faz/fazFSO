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
    const response = await api.get("/api/blogs");
    const blogs = response.body[0];
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
        const blogs = res.body;
        //console.log(`Blogs in the response: ${JSON.stringify(blogs, null, 2)}`);

        assert(blogs.length === blogsList.length + 1);
        assert(blogs.some((blog) => blog.title === singleBlog.title));
      })
      .expect("Content-Type", /application\/json/);
  });

  test("a blog without likes, defaults to 0", async () => {
    await api
      .post("/api/blogs")
      .send(noLikesBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    const blogs = response.body;
    const addedBlog = blogs.find((blog) => blog.title === noLikesBlog.title);

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

  after(async () => {
    await mongoose.connection.close();
  });
});
