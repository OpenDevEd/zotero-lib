/*
  Warnings:

  - The primary key for the `collections` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "collection_items" DROP CONSTRAINT "collection_items_collection_id_fkey";

-- AlterTable
ALTER TABLE "collection_items" ALTER COLUMN "collection_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "collections" DROP CONSTRAINT "collections_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "collections_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
