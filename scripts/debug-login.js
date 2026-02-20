require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Attempting to connect to database...");
    await prisma.$connect();
    console.log("Connected successfully.");

    const users = await prisma.user.findMany();
    console.log("Users in database:", JSON.stringify(users, null, 2));

    const specificUser = await prisma.user.findUnique({
      where: { username: "caio_drinking" }
    });

    if (specificUser) {
      console.log("Found user caio_drinking.");
      if (specificUser.password === "123qwe") {
        console.log("Password matches.");
      } else {
        console.log("Password mismatch! Found:", specificUser.password);
      }
    } else {
      console.log("User caio_drinking NOT found.");
      console.log("Creating user...");
      const newUser = await prisma.user.create({
        data: {
          username: "caio_drinking",
          password: "123qwe"
        }
      });
      console.log("User created successfully:", newUser);
    }
  } catch (e) {
    console.error("Connectivity or Query Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
