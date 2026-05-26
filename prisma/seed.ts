// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// 🧠 Yeh command code chalne se pehle .env file ko system mein load kar degi
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // Purana data clear karne ke liye
  await prisma.college.deleteMany();

  // 1. Stanford University
  await prisma.college.create({
    data: {
      name: "Stanford University",
      location: "Palo Alto, CA",
      image: "https://images.unsplash.com/photo-1581414841338-2d62a28b0300?w=500",
      fees: 57692,
      placementRate: 94,
      avgSalary: 145000,
      ranking: 3,
      rating: 4.9,
      type: "Private Research University",
      totalStudents: "17,400+",
      overview: "Stanford University is one of the world's leading research and teaching institutions. Located in the heart of Silicon Valley, it has been a catalyst for technological innovation...",
      courseTypes: ["Engineering", "Computer Science", "Business & Management"],
      topRecruiters: ["Google", "Apple", "Netflix"]
    }
  });

  // 2. MIT
  await prisma.college.create({
    data: {
      name: "MIT",
      location: "Cambridge, MA",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500",
      fees: 53450,
      placementRate: 97,
      avgSalary: 152000,
      ranking: 1,
      rating: 4.7,
      type: "Private Research University",
      totalStudents: "11,500+",
      overview: "The Massachusetts Institute of Technology is a private land-grant research university in Cambridge, Massachusetts...",
      courseTypes: ["Engineering", "Computer Science"],
      topRecruiters: ["NASA", "SpaceX", "Tesla"]
    }
  });

  // 3. Harvard University
  await prisma.college.create({
    data: {
      name: "Harvard University",
      location: "Cambridge, MA",
      image: "https://images.unsplash.com/photo-1622397333309-30564018d53c?w=500",
      fees: 54002,
      placementRate: 98,
      avgSalary: 148000,
      ranking: 4,
      rating: 4.6,
      type: "Private Research University",
      totalStudents: "21,000+",
      overview: "Harvard University is a private Ivy League research university in Cambridge, Massachusetts, established in 1636...",
      courseTypes: ["Liberal Arts", "Business & Management"],
      topRecruiters: ["Goldman", "McKinsey", "Bain"]
    }
  });

  console.log("Database seeded successfully! 🌱");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());