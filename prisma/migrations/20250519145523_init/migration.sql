/*
  Warnings:

  - You are about to drop the column `searchQuery` on the `Cache` table. All the data in the column will be lost.
  - Added the required column `coinName` to the `Cache` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cache" DROP COLUMN "searchQuery",
ADD COLUMN     "coinName" TEXT NOT NULL;
