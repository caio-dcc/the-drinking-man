import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./dev.db',
    },
  },
})

async function main() {
  const user = await prisma.user.upsert({
    where: { username: 'caio_drinking' },
    update: {
      password: '123qwe',
    },
    create: {
      username: 'caio_drinking',
      password: '123qwe',
    },
  })
  console.log({ user })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
