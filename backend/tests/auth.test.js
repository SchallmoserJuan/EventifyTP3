import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.JWT_SECRET = "testsecret";
  process.env.JWT_EXPIRES_IN = "1h";
  process.env.FRONTEND_URL = "http://localhost:5173";

  const module = await import("../src/app.js");
  app = module.default;
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe("Auth flow", () => {
  test("registro, login y perfil", async () => {
    const registerRes = await request(app).post("/api/auth/register").send({
      nombre: "Test Admin",
      email: "test@example.com",
      password: "Secret123",
    });

    expect(registerRes.statusCode).toBe(201);
    expect(registerRes.body.token).toBeDefined();
    expect(registerRes.body.user.role).toBe("admin");

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "Secret123",
    });

    expect(loginRes.statusCode).toBe(200);
    const token = loginRes.body.token;
    expect(token).toBeDefined();

    const meRes = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(meRes.statusCode).toBe(200);
    expect(meRes.body.data.email).toBe("test@example.com");
  });
});
