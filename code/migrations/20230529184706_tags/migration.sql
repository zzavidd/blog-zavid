/*
  Warnings:

  - You are about to alter the column `tags` on the `diary` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.

*/
-- AlterTable
ALTER TABLE `diary` MODIFY `tags` JSON NOT NULL;
