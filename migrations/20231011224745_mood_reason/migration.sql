/*
  Warnings:

  - Added the required column `reason` to the `Mood` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Mood` ADD COLUMN `reason` TEXT NOT NULL;
