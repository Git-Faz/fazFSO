import { test, describe } from "node:test";
import { deepStrictEqual, strictEqual } from "node:assert";
import { dummy, totalLikes, favoriteBlog } from "../utils/list_helper.js";
import { blogsList, emptyBlogs, singleBlog } from "./test_helper.js";

// Test cases for list_helper.js
describe("dummy", () => {
  test("returns one", () => {
    const blogs = [];

    const result = dummy(blogs);
    strictEqual(result, 1);
  });
});

describe("total likes", () => {
  test("returns zero for empty list", () => {
    const result = totalLikes(emptyBlogs);
    console.log(`Total likes: ${result}`);
    strictEqual(result, 0);
    
  });

  test("returns likes for a single blog", () => {
    const result = totalLikes(singleBlog);
    console.log(`Total likes: ${result}`);
    strictEqual(result, 7);
  });

  test("returns total likes for a list with many blogs", () => {
    const result = totalLikes(blogsList);
    console.log(`Total likes: ${result}`);
    
    strictEqual(result, 36);
  });
});

describe('favorite blog', () => {
  test('returns null for empty list', () => {
    const result = favoriteBlog(emptyBlogs);
    strictEqual(result, null);
  });

  test('returns the only blog as favorite', () => {
    const result = favoriteBlog(singleBlog);
    deepStrictEqual(result, singleBlog[0]);
  });

  test('return the blog with most likes', () => {
    const result = favoriteBlog(blogsList);
    console.log(`Favorite blog: ${JSON.stringify(result)}`);
    deepStrictEqual(result, blogsList[2]); // The blog with 12 likes
  });
})
