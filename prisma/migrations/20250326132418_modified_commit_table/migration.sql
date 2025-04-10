/*
  Warnings:

  - You are about to drop the column `commitAuthorHash` on the `Commit` table. All the data in the column will be lost.
  - Added the required column `commitHash` to the `Commit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Commit" DROP COLUMN "commitAuthorHash",
ADD COLUMN     "commitHash" TEXT NOT NULL;
