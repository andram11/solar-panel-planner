-- CreateTable
CREATE TABLE "Daily_Appointments_Counter" (
    "id" SERIAL NOT NULL,
    "date" VARCHAR(10) NOT NULL,
    "counter" INTEGER NOT NULL,

    CONSTRAINT "Daily_Appointments_Counter_pkey" PRIMARY KEY ("id")
);
