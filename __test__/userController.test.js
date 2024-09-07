const request = require("supertest");
const app = require("../server");
const { PrismaClient } = require("@prisma/client");

// Mock Prisma Client
jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe("UserController Tests", () => {
  test("that you can retrieve all users", async () => {
    // Mock the behavior for findMany
    prisma.user.findMany.mockResolvedValue([
      { id: 1, username: "user1", post: [] },
      { id: 2, username: "user2", post: [] },
    ]); // Simulate multiple users found

    const response = await request(app).get("/users");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty("username", "user1");
    expect(response.body[1]).toHaveProperty("username", "user2");
  });

  test("that you can retrieve a single user by ID", async () => {
    // Mock the behavior for findUnique
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      username: "user1",
      post: [],
    }); // Simulate a single user found

    const response = await request(app).get("/users/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("username", "user1");
  });

  test("that retrieving a single user fails when the user is not found", async () => {
    // Mock the behavior for findUnique
    prisma.user.findUnique.mockResolvedValue(null); // Simulate user not found

    const response = await request(app).get("/users/999");

    expect(response.status).toBe(404);
    expect(response.text).toBe("User not found");
  });
});
