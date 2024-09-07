const request = require("supertest");
const app = require("../server");
const { PrismaClient } = require("@prisma/client");

// Mock Prisma Client
jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    post: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe("PostController Tests", () => {
  test("that you can retrieve all posts", async () => {
    // Mock the behavior for findMany
    prisma.post.findMany.mockResolvedValue([
      { id: 1, title: "First Post", content: "Content of first post" },
      { id: 2, title: "Second Post", content: "Content of second post" },
    ]); // Simulate multiple posts found

    const response = await request(app).get("/posts");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty("title", "First Post");
    expect(response.body[1]).toHaveProperty("title", "Second Post");
  });

  test("that you can retrieve a single post by ID", async () => {
    // Mock the behavior for findUnique
    prisma.post.findUnique.mockResolvedValue({
      id: 1,
      title: "First Post",
      content: "Content of first post",
    }); // Simulate a single post found

    const response = await request(app).get("/posts/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("title", "First Post");
  });

  test("that retrieving a single post fails when post is not found", async () => {
    // Mock the behavior for findUnique
    prisma.post.findUnique.mockResolvedValue(null); // Simulate post not found

    const response = await request(app).get("/posts/999");

    expect(response.status).toBe(404);
    expect(response.text).toBe("Post not found");
  });

  test("that you can create a new post", async () => {
    // Mock the behavior for create
    prisma.post.create.mockResolvedValue({
      id: 1,
      title: "New Post",
      content: "Content of new post",
    }); // Simulate post creation

    const response = await request(app).post("/posts").send({
      title: "New Post",
      content: "Content of new post",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("title", "New Post");
  });

  test("that you can update a post by ID", async () => {
    // Mock the behavior for update
    prisma.post.update.mockResolvedValue({
      id: 1,
      title: "Updated Post",
      content: "Updated content of the post",
    }); // Simulate post update

    const response = await request(app).put("/posts/1").send({
      title: "Updated Post",
      content: "Updated content of the post",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("title", "Updated Post");
    expect(response.body).toHaveProperty(
      "content",
      "Updated content of the post"
    );
  });

  test("that you can delete a post by ID", async () => {
    // Mock the behavior for delete
    prisma.post.delete.mockResolvedValue({}); // Simulate post deletion

    const response = await request(app).delete("/posts/1");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Post successfully deleted");
  });
});
