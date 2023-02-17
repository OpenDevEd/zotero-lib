/*
  Warnings:

  - You are about to drop the column `CreatedAt` on the `groups` table. All the data in the column will be lost.
  - You are about to drop the column `UpdatedAt` on the `groups` table. All the data in the column will be lost.
  - Added the required column `createdAt` to the `groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `groups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "groups" DROP COLUMN "CreatedAt",
DROP COLUMN "UpdatedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
