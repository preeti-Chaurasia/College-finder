-- CreateTable
CREATE TABLE "College" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "fees" INTEGER NOT NULL,
    "placementRate" INTEGER NOT NULL,
    "avgSalary" INTEGER NOT NULL,
    "ranking" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "totalStudents" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "courseTypes" TEXT[],
    "topRecruiters" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);
