const request = require("supertest");
const app = require("../server");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Mock Prisma Client
jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe("AuthController Tests", () => {
  test("that you can register an account", async () => {
    // Mock the behavior for findUnique and create
    prisma.user.findUnique.mockResolvedValue(null); // Simulate user not found
    prisma.user.create.mockResolvedValue({
      id: 1,
      username: "testuser1",
      password: await bcrypt.hash("testpassword", 10),
    }); // Simulate user creation

    const response = await request(app).post("/auth/register").send({
      username: "testuser1",
      password: "testpassword",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
  });

  test("that you can log in with valid credentials", async () => {
    // Mock the behavior for findUnique
    const hashedPassword = await bcrypt.hash("testpassword", 10);
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      username: "testuser1",
      password: hashedPassword,
    }); // Simulate user found with hashed password

    const response = await request(app).post("/auth/login").send({
      username: "testuser1",
      password: "testpassword",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Successfully logged in.");
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
  });

  test("that login fails with invalid credentials", async () => {
    // Mock the behavior for findUnique
    const hashedPassword = await bcrypt.hash("testpassword", 10);
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      username: "testuser1",
      password: hashedPassword,
    }); // Simulate user found with hashed password

    const response = await request(app).post("/auth/login").send({
      username: "testuser1",
      password: "wrongpassword", // Incorrect password
    });

    expect(response.status).toBe(401);
    expect(response.text).toBe("Invalid credentials");
  });

  test("that login fails when user is not found", async () => {
    // Mock the behavior for findUnique
    prisma.user.findUnique.mockResolvedValue(null); // Simulate user not found

    const response = await request(app).post("/auth/login").send({
      username: "nonexistentuser",
      password: "somepassword",
    });

    expect(response.status).toBe(401);
    expect(response.text).toBe("User not found");
  });
});
