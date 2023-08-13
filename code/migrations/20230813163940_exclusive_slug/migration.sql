/*
  Warnings:

  - You are about to alter the column `subject` on the `exclusives` table. The data in that column could be lost. The data in that column will be cast from `VarChar(128)` to `VarChar(96)`.
  - You are about to alter the column `endearment` on the `exclusives` table. The data in that column could be lost. The data in that column will be cast from `VarChar(64)` to `VarChar(24)`.

*/
-- AlterTable
ALTER TABLE `exclusives` ADD COLUMN `slug` VARCHAR(96) NULL,
    MODIFY `subject` VARCHAR(96) NOT NULL,
    MODIFY `endearment` VARCHAR(24) NOT NULL;
