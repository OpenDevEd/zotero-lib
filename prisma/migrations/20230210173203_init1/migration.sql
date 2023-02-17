/*
  Warnings:

  - The primary key for the `items` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "alsoKnownAs" DROP CONSTRAINT "alsoKnownAs_item_id_fkey";

-- DropForeignKey
ALTER TABLE "collection_items" DROP CONSTRAINT "collection_items_item_id_fkey";

-- AlterTable
ALTER TABLE "alsoKnownAs" ALTER COLUMN "item_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "collection_items" ALTER COLUMN "item_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "items" DROP CONSTRAINT "items_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "items_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alsoKnownAs" ADD CONSTRAINT "alsoKnownAs_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
