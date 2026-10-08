import prisma from "../src/config/prisma.js";

const dentsFDI = [
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
];

async function main() {
  const result = await prisma.dent.createMany({
    data: dentsFDI.map((number) => ({ number })),
    skipDuplicates: true,
  });

  const total = await prisma.dent.count();

  console.log(`Dents ajoutées : ${result.count}`);
  console.log(`Total des dents en base : ${total}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
