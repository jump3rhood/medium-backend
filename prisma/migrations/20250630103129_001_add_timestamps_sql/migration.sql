/*
  Warnings:

  - Added the required column `updatedAt` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/

-- AlterTable
ALTER TABLE "User" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();

-- AlterTable  
ALTER TABLE "Post" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();

-- Update existing records to have proper timestamps
-- Set createdAt to a reasonable past date for existing records
UPDATE "User" SET "createdAt" = NOW() - INTERVAL '30 days';

UPDATE "Post" SET "createdAt" = NOW() - INTERVAL '30 days';

-- Update updatedAt to be more recent than createdAt
UPDATE "User" SET "updatedAt" = NOW() - INTERVAL '15 days';

UPDATE "Post" SET "updatedAt" = NOW() - INTERVAL '15 days';