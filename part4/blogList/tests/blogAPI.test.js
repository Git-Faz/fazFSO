import {beforeEach, after, describe, test} from 'node:test'
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js"; 
import { Blog } from "../models/blog.js";
import { blogsList, singleBlog, emptyBlogs } from "./test_helper.js";
import { assert } from 'console';
import { strictEqual } from 'assert';

const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(blogsList);
})

describe("Blog API Tests", () => {
    test("should return all blogs in JSON:", async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test("unique identifier is named id", async () => {
        const response = await api.get('/api/blogs');
        const blogs = response.body[0];
        const keys = Object.keys(blogs);
        console.log(`Keys in the first blog: ${keys}`);
        assert(keys.includes('id'));
        strictEqual(keys.includes('_id'), false);
    })

    after(async () => {
        await mongoose.connection.close()
    })
})