import { beforeEach, after, describe, test } from "node:test";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import { Blog } from "../models/blog.js";
import { User } from "../models/user.js";
import { blogsList, singleBlog, invalidBlog, noLikesBlog, blogsInDb } from "./test_helper.js";
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
    const blogsAtStart = await blogsInDb();
    console.log(`Blogs at start: ${blogsAtStart.length}`);

    await api
      .post("/api/blogs")
      .send(singleBlog)
      .set("Authorization", `Bearer ${token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await blogsInDb();
    console.log(`Blogs at end: ${blogsAtEnd.length}`);
    console.log(`New blog added: ${blogsAtEnd[blogsAtEnd.length - 1].title}`);

    // Verify the count increased by 1
    assert.strictEqual(blogsAtStart.length + 1, blogsAtEnd.length);
    
    // Verify the specific blog was added
    const addedBlog = blogsAtEnd.find(blog => blog.title === singleBlog.title);
    assert(addedBlog);
    assert.strictEqual(addedBlog.author, singleBlog.author);
    assert.strictEqual(addedBlog.url, singleBlog.url);
  });

  test("adding a blog without token returns 401", async () => {
    await api
      .post("/api/blogs")
      .send(singleBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  test("a blog without likes, defaults to 0", async () => {
    const blogsAtStart = await blogsInDb();
    console.log(`Blogs before adding no-likes blog: ${blogsAtStart.length}`);

    await api
      .post("/api/blogs")
      .send(noLikesBlog)
      .set("Authorization", `Bearer ${token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await blogsInDb();
    console.log(`Blogs after adding no-likes blog: ${blogsAtEnd.length}`);
    
    const addedBlog = blogsAtEnd.find(
      (blog) => blog.title === noLikesBlog.title
    );

    console.log(`Added blog likes: ${addedBlog.likes}`);
    assert(addedBlog.likes === 0);
    strictEqual(addedBlog.likes, 0);
    assert.strictEqual(blogsAtStart.length + 1, blogsAtEnd.length);
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
      const blogsAtStart = await blogsInDb();
      console.log(`Blogs at start: ${blogsAtStart.length}`);
      
      // Create a blog first
      const newBlogResponse = await api
        .post("/api/blogs")
        .send(singleBlog)
        .set("Authorization", `Bearer ${token}`)
        .expect(201);

      const createdBlog = newBlogResponse.body;
      console.log(`Created blog: ${createdBlog.title}`);

      const blogsAfterCreation = await blogsInDb();
      console.log(`Blogs after creation: ${blogsAfterCreation.length}`);

      // Delete the blog we just created
      await api
        .delete(`/api/blogs/${createdBlog.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const blogsAfterDeletion = await blogsInDb();
      console.log(`Blogs after deletion: ${blogsAfterDeletion.length}`);
      console.log(`Deleted blog: ${createdBlog.title}`);

      // Verify the blog count is back to original
      assert.strictEqual(blogsAtStart.length, blogsAfterDeletion.length);
      
      // Verify the specific blog was removed
      const deletedBlog = blogsAfterDeletion.find(blog => blog.id === createdBlog.id);
      assert.strictEqual(deletedBlog, undefined);
    });
  });

  describe("updating of blogs", () => {
    test("should update a blog by id", async () => {
      const blogsAtStart = await blogsInDb();
      console.log(`Blogs at start: ${blogsAtStart.length}`);

      // First create a blog
      const newBlogResponse = await api
        .post("/api/blogs")
        .send(singleBlog)
        .set("Authorization", `Bearer ${token}`)
        .expect(201);

      const createdBlog = newBlogResponse.body;
      console.log(`Created blog: '${createdBlog.title}' with ${createdBlog.likes} likes`);

      const blogsAfterCreation = await blogsInDb();
      console.log(`Blogs after creation: ${blogsAfterCreation.length}`);

      // Update the blog
      const updateData = { title: "Updated Title", likes: 100 };
      await api
        .put(`/api/blogs/${createdBlog.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const blogsAfterUpdate = await blogsInDb();
      console.log(`Blogs after update: ${blogsAfterUpdate.length}`);
      
      const updatedBlog = blogsAfterUpdate.find(
        (blog) => blog.id === createdBlog.id
      );
      
      console.log(`Updated blog: '${updatedBlog.title}' with ${updatedBlog.likes} likes`);
      
      // Verify the blog count stayed the same
      assert.strictEqual(blogsAfterCreation.length, blogsAfterUpdate.length);
      
      // Verify the specific fields were updated
      assert.strictEqual(updatedBlog.title, updateData.title);
      assert.strictEqual(updatedBlog.likes, updateData.likes);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
