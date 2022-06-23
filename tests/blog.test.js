const supertest = require("supertest");
const User = require("../models/User");
const Post = require("../models/Blog");
const { connectDb, closeDb } = require("./db");
//const { user, token } = require("./fixtures");
const {
  postCreateData,
  userRegData,
  incorrectPostCreateData,
} = require("./mockData");
const app = require("../app");
const { post } = require("../app");

const client = supertest.agent(app);

// beforeAll(async () => {
//   await connectDb();
//   const user = await User.create(userRegData);
//   const token = await user.createToken();
//   client.set("Authorization", `Bearer ${token}`);
// });

let user;

beforeEach(async () => {
  await connectDb();
  user = await User.create(userRegData);
  const token = await user.createToken();
  client.set("Authorization", `Bearer ${token}`);
});

afterEach(async () => {
  await closeDb();
});

describe("Blog Test Suite", () => {
  describe("Test Create Post endpoint", () => {
    it("with everything as it should", async () => {
      const res = await client.post("/api/posts").send(postCreateData);
      expect(res.statusCode).toEqual(201);
      expect(res.body._id).toBeTruthy();
      expect(res.body.createdAt).toBeTruthy();
    });

    it("without Authorization headers", async () => {
      const res = await client
        .post("/api/posts")
        .set("Authorization", "")
        .send(postCreateData);

      expect(res.statusCode).toEqual(401);
      expect(res.body._id).toBeFalsy();
    });

    it("without required fields", async () => {
      const res = await client.post("/api/posts").send(incorrectPostCreateData);

      expect(res.statusCode).toEqual(500);
      expect(res.body.id).toBeFalsy();
    });
  });

  describe("Test Get Posts endpoint", () => {
    it("with everything as it should", async () => {
      await client
        .post("/api/posts")
        .send({ title: "Test Post 1", body: "Test Post 1 Body" });

      await client
        .post("/api/posts")
        .send({ title: "Test Post 2", body: "Test Post 2 Body" });

      const res = await client.get("/api/posts");

      expect(res.statusCode).toEqual(200);
      expect(res.body.count).toEqual(2);
      expect(res.body.posts[0]["title"]).toEqual("Test Post 1");
      expect(res.body.posts[1]["title"]).toEqual("Test Post 2");
    });

    it("without Authorization header", async () => {
      const res = await client.get("/api/posts").set("Authorization", "");

      expect(res.statusCode).toEqual(401);
      expect(res.body.posts).toBeFalsy();
    });
  });

  describe("Test Get Post Endpoint", () => {
    let post;
    it("with everything as it should be", async () => {
      post = await client
        .post("/api/posts")
        .send({ title: "Test Post", body: "Test Post Body" });

      const res = await client.get("/api/posts/" + post.body._id);

      expect(res.statusCode).toEqual(200);
      expect(res.body._id).toEqual(post.body._id);
      expect(res.body.author).toEqual(user._id.toString());
      expect(res.body.title).toEqual("Test Post");
    });

    it("without Authorization", async () => {
      const res = await client
        .get("/api/posts/" + post.body._id)
        .set("Authorization", "");

      expect(res.statusCode).toEqual(401);
      expect(res.body._id).toBeFalsy();
    });

    it("with invalid id", async () => {
      const res = await client.get("/api/posts/invalid");

      expect(res.statusCode).toEqual(500);
      expect(res.body._id).toBeFalsy();
    });
  });

  describe("Test Post Update Endpoint", () => {
    let post;
    const updateData = {
      title: "Updated Post",
      body: "This post has been Updated",
    };
    it("with everything as it should be", async () => {
      post = await client
        .post("/api/posts")
        .send({ title: "Test Post", body: "Test Post Body" });

      res = await client.patch("/api/posts/" + post.body._id).send(updateData);

      updatedPost = await Post.findOne({ _id: res.body._id });

      expect(res.body._id).toEqual(post.body._id);
      expect(updateData.title).toEqual(updateData.title);
      expect(updateData.body).toEqual(updateData.body);
    });

    it("without Authorization header", async () => {
      res = await client
        .patch("/api/posts/" + post.body._id)
        .set("Authorization", "")
        .send(updateData);

      expect(res.statusCode).toEqual(401);
      expect(res.body._id).toBeFalsy();
    });

    it("with invalidated fields", async () => {
      res = await client
        .patch("/api/posts/" + post.body._id)
        .send({ title: "st", body: "shortbody" });

      expect(res.statusCode).toEqual(500);
      expect(res.body._id).toBeFalsy();
    });

    it("with invalid id", async () => {
      const res = await client.patch("/api/posts/invalid");

      expect(res.statusCode).toEqual(500);
      expect(res.body._id).toBeFalsy();
    });
  });

  describe("Test Post Delete Endpoints", () => {
    let post;
    it("with everything as it should be", async () => {
      // Create two posts
      post = await client
        .post("/api/posts")
        .send({ title: "Test Post 1", body: "Test Post Body 1" });

      await client
        .post("/api/posts")
        .send({ title: "Test Post 2", body: "Test Post Body 2" });

      // Assert creation
      posts = await client.get("/api/posts");
      expect(posts.body.count).toEqual(2);

      // Delete one post
      const postDelete = await client.delete("/api/posts/" + post.body._id);

      // Assert deletion
      expect(postDelete.statusCode).toEqual(204);
      posts = await client.get("/api/posts");
      expect(posts.body.count).toEqual(1);
    });
  });
});
