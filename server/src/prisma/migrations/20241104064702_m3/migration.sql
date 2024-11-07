-- AlterTable
ALTER TABLE "Address_listing" ALTER COLUMN "street_prefix_direction" DROP NOT NULL,
ALTER COLUMN "street_prefix_type" DROP NOT NULL,
ALTER COLUMN "street_suffix_type" DROP NOT NULL,
ALTER COLUMN "street_suffix_direction" DROP NOT NULL,
ALTER COLUMN "street_extension" DROP NOT NULL;
