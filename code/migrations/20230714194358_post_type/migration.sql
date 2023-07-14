/*
  Warnings:

  - Made the column `type` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `posts` MODIFY `type` ENUM('REVERIE', 'EPISTLE', 'POEM', 'MUSING', 'ADDENDUM', 'PASSAGE') NOT NULL;
