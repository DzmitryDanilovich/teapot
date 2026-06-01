/*
  Warnings:

  - The `type` column on the `Tea` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TeaType" AS ENUM ('green', 'black', 'oolong', 'white', 'pu-erh');

-- AlterTable
ALTER TABLE "Tea" DROP COLUMN "type",
ADD COLUMN     "type" "TeaType";
