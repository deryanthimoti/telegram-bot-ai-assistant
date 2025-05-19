-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "command" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);
