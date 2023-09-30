/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `diary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `exclusives` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `posts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `wishlist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `wishlist_categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `id_UNIQUE` ON `diary`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `id_UNIQUE` ON `exclusives`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `id_UNIQUE` ON `posts`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `id_UNIQUE` ON `wishlist`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `id_UNIQUE` ON `wishlist_categories`(`id`);
