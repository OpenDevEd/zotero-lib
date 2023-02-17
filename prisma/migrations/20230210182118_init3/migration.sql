-- AlterTable
CREATE SEQUENCE alsoknownas_id_seq;
ALTER TABLE "alsoKnownAs" ALTER COLUMN "id" SET DEFAULT nextval('alsoknownas_id_seq');
ALTER SEQUENCE alsoknownas_id_seq OWNED BY "alsoKnownAs"."id";
