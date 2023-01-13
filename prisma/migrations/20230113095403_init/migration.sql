-- CreateTable
CREATE TABLE "Hostels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Hostels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rooms" (
    "id" SERIAL NOT NULL,
    "roomLabel" TEXT NOT NULL,
    "numberOfBeds" INTEGER NOT NULL,
    "hostelName" TEXT NOT NULL,

    CONSTRAINT "Rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Students" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "department" TEXT NOT NULL,
    "hostelName" TEXT NOT NULL,
    "room" TEXT NOT NULL,

    CONSTRAINT "Students_pkey" PRIMARY KEY ("id")
);
