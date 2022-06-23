const supertest = require("supertest");
const { connectDb, closeDb } = require("./db");
const { userRegData, incorrectRegData, userLoginData } = require("./mockData");
const app = require("../app");

const client = supertest.agent(app);

beforeAll(async () => await connectDb());
afterAll(async () => await closeDb());

describe("User Registration Test Suite", () => {
  it("Test create New User, with everything as it should be", async () => {
    const res = await client.post("/api/auth/register").send(userRegData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toBeTruthy();
    expect(res.body.id).toBeTruthy();
    expect(res.body.token).toBeTruthy();
    expect(res.body.username).toBe(userRegData.username.toLowerCase());
  });

  it("Test create New user, with a few required fields missing", async () => {
    const res = await client.post("/api/auth/register").send(incorrectRegData);
    expect(res.statusCode).toEqual(500);
    expect(res.body.id).toBeFalsy();
    expect(res.body.token).toBeFalsy();
  });

  it("Test create New user, with already existing unique user details", async () => {
    const res = await client.post("/api/auth/register").send(userRegData);
    expect(res.statusCode).toEqual(500);
  });
});

describe("User Login Test Suites", () => {
  it("Test user login, with everything as it should", async () => {
    const res = await client
      .post("/api/auth/login")
      .send({ username: "testuser", password: "testpassword" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeTruthy();
  });

  it("Test user login, with invalid username", async () => {
    const res = await client
      .post("/api/auth/login")
      .send({ username: "invalid", password: "testpassword" });
    expect(res.statusCode).toEqual(401);
    expect(res.body.token).toBeFalsy();
  });

  it("Test user login, with wrong password", async () => {
    const res = await client
      .post("/api/auth/login")
      .send({ username: "testuser", password: "wrongpassword" });
    expect(res.statusCode).toEqual(401);
    expect(res.body.token).toBeFalsy();
  });

  describe("Test user login without Username and password", () => {
    it("Test user Login without username", async () => {
      const res = await client
        .post("/api/auth/login")
        .send({ password: "testpassword" });
      expect(res.statusCode).toEqual(400);
      expect(res.body.token).toBeFalsy();
    });

    it("Test user Login without Password", async () => {
      const res = await client
        .post("/api/auth/login")
        .send({ username: "testuser" });
      expect(res.statusCode).toEqual(400);
      expect(res.body.token).toBeFalsy();
    });
  });
});
