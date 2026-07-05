import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const nagpur = await prisma.city.upsert({ where: { name: "Nagpur" }, update: {}, create: { name: "Nagpur", isLive: true } });
  for (const name of ["Pune", "Mumbai", "Nashik"]) {
    await prisma.city.upsert({ where: { name }, update: {}, create: { name, isLive: false } });
  }

  const categories = [
    { name: "Plumbing", icon: "Wrench", startingPrice: 19900 },
    { name: "Electrician", icon: "Zap", startingPrice: 14900 },
    { name: "AC Repair", icon: "Wind", startingPrice: 34900 },
    { name: "Carpenter", icon: "Hammer", startingPrice: 24900 },
    { name: "Cleaning", icon: "Sparkles", startingPrice: 39900 },
    { name: "Appliance Repair", icon: "Settings", startingPrice: 29900 },
  ];
  for (const c of categories) {
    const category = await prisma.category.upsert({ where: { name: c.name }, update: {}, create: c });
    await prisma.service.upsert({
      where: { id: `${category.id}-default` },
      update: {},
      create: { id: `${category.id}-default`, categoryId: category.id, name: `${c.name} — Standard Visit`, basePrice: c.startingPrice },
    });
  }

  // Seed the one admin account (admin sign-up is intentionally not
  // self-service — see the register route, which only allows
  // customer/professional roles).
  const adminPasswordHash = await bcrypt.hash("ChangeMe123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@nexora.example" },
    update: {},
    create: {
      name: "Nexora Admin",
      email: "admin@nexora.example",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      emailVerified: new Date(),
      admin: { create: { permissions: ["*"] } },
    },
  });

  console.log("Seed complete. Admin login: admin@nexora.example / ChangeMe123!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
