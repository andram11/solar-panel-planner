-- CreateEnum
CREATE TYPE "Status" AS ENUM ('CREATED', 'ASSIGNED', 'DONE', 'CANCELLED');

-- CreateTable
CREATE TABLE "Address_listing" (
    "id" SERIAL NOT NULL,
    "address_no" VARCHAR(100) NOT NULL,
    "street_prefix_direction" VARCHAR(2) NOT NULL,
    "street_prefix_type" VARCHAR(25) NOT NULL,
    "street_name" VARCHAR(50) NOT NULL,
    "street_suffix_type" VARCHAR(10) NOT NULL,
    "street_suffix_direction" VARCHAR(2) NOT NULL,
    "street_extension" VARCHAR(3) NOT NULL,
    "full_address" VARCHAR(255) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "zip" INTEGER NOT NULL,

    CONSTRAINT "Address_listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Street_Suffix_Ref" (
    "id" SERIAL NOT NULL,
    "street_prefix_type" VARCHAR(10) NOT NULL,

    CONSTRAINT "Street_Suffix_Ref_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointments" (
    "id" SERIAL NOT NULL,
    "fk_address" INTEGER NOT NULL,
    "fName" VARCHAR(50) NOT NULL,
    "lName" VARCHAR(50) NOT NULL,
    "phoneNumber" VARCHAR(50) NOT NULL,
    "requested_date" VARCHAR(10) NOT NULL,
    "pref_timeslot" INTEGER,
    "status" "Status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "comments" VARCHAR(255),

    CONSTRAINT "Appointments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_fk_address_fkey" FOREIGN KEY ("fk_address") REFERENCES "Address_listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
