-- CreateTable
CREATE TABLE `exclusives` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `subject` VARCHAR(128) NOT NULL,
    `content` TEXT NOT NULL,
    `preview` TEXT NOT NULL,
    `endearment` VARCHAR(64) NOT NULL,
    `date` DATE NULL,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
