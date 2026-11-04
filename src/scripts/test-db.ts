import { prisma } from "../db.js";

async function main() {
  const result = await prisma.$queryRaw`SELECT 1 AS ok`;
  console.log(result);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());