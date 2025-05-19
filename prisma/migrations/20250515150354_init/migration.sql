/*
  Warnings:

  - Added the required column `userId` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "username" TEXT;
