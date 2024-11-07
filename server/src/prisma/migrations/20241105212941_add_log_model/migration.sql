-- CreateTable
CREATE TABLE "ApplicationLog" (
    "id" SERIAL NOT NULL,
    "level" VARCHAR(50) NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationLog_pkey" PRIMARY KEY ("id")
);
