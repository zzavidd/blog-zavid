-- CreateTable
CREATE TABLE `diary_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `diary_categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DiaryToDiaryCategory` (
    `A` INTEGER UNSIGNED NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DiaryToDiaryCategory_AB_unique`(`A`, `B`),
    INDEX `_DiaryToDiaryCategory_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_DiaryToDiaryCategory` ADD CONSTRAINT `_DiaryToDiaryCategory_A_fkey` FOREIGN KEY (`A`) REFERENCES `diary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiaryToDiaryCategory` ADD CONSTRAINT `_DiaryToDiaryCategory_B_fkey` FOREIGN KEY (`B`) REFERENCES `diary_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
