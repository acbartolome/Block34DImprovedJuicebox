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

    // add 3 users
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

    // add 3 poost to each instructor
    await Promise.all(
      users.flatMap((user, i) =>
        [...Array(3)].map(() =>
          prisma.post.create({
            data: {
              title: faker.lorem.words(),
              content: faker.lorem.paragraphs(),
              userId: user.id,
            },
          })
        )
      )
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
