-- AlterTable
CREATE SEQUENCE collection_items_id_seq;
ALTER TABLE "collection_items" ALTER COLUMN "id" SET DEFAULT nextval('collection_items_id_seq');
ALTER SEQUENCE collection_items_id_seq OWNED BY "collection_items"."id";
