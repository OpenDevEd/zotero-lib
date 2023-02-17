-- DropForeignKey
ALTER TABLE "alsoKnownAs" DROP CONSTRAINT "alsoKnownAs_item_id_fkey";

-- AddForeignKey
ALTER TABLE "alsoKnownAs" ADD CONSTRAINT "alsoKnownAs_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
