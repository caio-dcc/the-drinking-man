const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./prisma/dev.db"
    }
  }
});

async function main() {
  try {
    console.log("Checking Prisma Client connection...");
    await prisma.$connect();
    console.log("SUCCESS: Connected to database.");
    
    const userCount = await prisma.user.count();
    console.log("Number of users:", userCount);
    
    const caio = await prisma.user.findUnique({
      where: { username: "caio_drinking" }
    });
    
    if (caio) {
      console.log("User caio_drinking found.");
    } else {
      console.log("User caio_drinking NOT found. Creating...");
      await prisma.user.create({
        data: {
          username: "caio_drinking",
          password: "123qwe"
        }
      });
      console.log("User created.");
    }
  } catch (error) {
    console.error("FAILED to initialize or query database:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
