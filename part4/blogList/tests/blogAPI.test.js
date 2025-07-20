import { beforeEach, after, describe, test } from "node:test";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import { Blog } from "../models/blog.js";
import { User } from "../models/user.js";
import { blogsList, singleBlog, invalidBlog, noLikesBlog, } from "./test_helper.js";
import assert, { strictEqual } from "assert";

const api = supertest(app);
let token;

// Test user data
const testUser = {
  username: "testuser",
  name: "Test User",
  password: "password123",
};

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  await api.post("/api/users").send(testUser).expect(201);

  // Login to get the token
  const loginResponse = await api
    .post("/api/login")
    .send({
      username: testUser.username,
      password: testUser.password,
    })
    .expect(200);

  token = loginResponse.body.token;

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
      .set("Authorization", `Bearer ${token}`)
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

  test("adding a blog without token returns 401", async () => {
    await api
      .post("/api/blogs")
      .send(singleBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  test("a blog without likes, defaults to 0", async () => {
    await api
      .post("/api/blogs")
      .send(noLikesBlog)
      .set("Authorization", `Bearer ${token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const updatedBlogs = await api.get("/api/blogs");
    const addedBlog = updatedBlogs.body.find(
      (blog) => blog.title === noLikesBlog.title
    );

    assert(addedBlog.likes === 0);
    strictEqual(addedBlog.likes, 0);
  });

  test("a blog without title or url returns 400", async () => {
    await api
      .post("/api/blogs")
      .send(invalidBlog)
      .set("Authorization", `Bearer ${token}`)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  describe("deletion of blogs", () => {
    test("should delete a blog created by the authenticated user", async () => {
      const currentBlogs = await api.get("/api/blogs");

      const newBlogResponse = await api
        .post("/api/blogs")
        .send(singleBlog)
        .set("Authorization", `Bearer ${token}`)
        .expect(201);

      const createdBlog = newBlogResponse.body;

      // Delete the blog we just created
      await api
        .delete(`/api/blogs/${createdBlog.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      //console.log(`\nDeleted blog: ${createdBlog.title}`);

      const updatedBlogs = await api.get("/api/blogs");

      assert(updatedBlogs.body.length === currentBlogs.body.length);
      assert(!updatedBlogs.body.some((blog) => blog.id === createdBlog.id));
    });
  });

  describe("updating of blogs", () => {
    test("should update a blog by id", async () => {
      // First create a blog
      const newBlogResponse = await api
        .post("/api/blogs")
        .send(singleBlog)
        .set("Authorization", `Bearer ${token}`)
        .expect(201);

      const createdBlog = newBlogResponse.body;
      /* console.log(
        `Updating the blog: '${createdBlog.title}' which has ${createdBlog.likes} likes`
      ); */

      await api
        .put(`/api/blogs/${createdBlog.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Updated Title", likes: 100 })
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const updatedBlogs = await api.get("/api/blogs");
      const updatedBlog = updatedBlogs.body.find(
        (blog) => blog.id === createdBlog.id
      );
      /* console.log(
        `Updated the blog: '${createdBlog.title}' to the name '${updatedBlog.title}' with ${updatedBlog.likes} likes`
      ); */
      assert(updatedBlog.likes === 100);
      strictEqual(updatedBlog.likes, 100);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
