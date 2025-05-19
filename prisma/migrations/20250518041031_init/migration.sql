-- CreateTable
CREATE TABLE "Cache" (
    "id" SERIAL NOT NULL,
    "coinId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cache_pkey" PRIMARY KEY ("id")
);
