const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function resetDatabase() {
  await prisma.$executeRaw`BEGIN`;
  await prisma.$executeRaw`TRUNCATE TABLE "Post" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`COMMIT`;
}

async function seedData() {
  console.log("Seeding the database");
  try {
    // clear the database
    await resetDatabase();

    // add 3 users with 3 posts each
    const users = await Promise.all(
      [...Array(3)].map(async () => {
        return prisma.user.create({
          data: {
            username: faker.internet.userName(),
            password: faker.internet.password(),
            post: {
              create: [
                {
                  title: faker.lorem.words(),
                  content: faker.lorem.paragraphs(),
                },
                {
                  title: faker.lorem.words(),
                  content: faker.lorem.paragraphs(),
                },
                {
                  title: faker.lorem.words(),
                  content: faker.lorem.paragraphs(),
                },
              ],
            },
          },
        });
      })
    );
    console.log("Database is seeded");
  } catch (error) {
    console.error(error);
  }
}

if (require.main === module) {
  seedData();
}

module.exports = seedData;
