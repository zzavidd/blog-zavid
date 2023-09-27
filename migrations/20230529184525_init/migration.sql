-- CreateTable
CREATE TABLE `diary` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `date` DATE NULL,
    `content` TEXT NOT NULL,
    `status` ENUM('DRAFT', 'PROTECTED', 'PRIVATE', 'PUBLISHED') NOT NULL,
    `entryNumber` INTEGER UNSIGNED NOT NULL,
    `footnote` TEXT NOT NULL,
    `isFavourite` BOOLEAN NOT NULL DEFAULT false,
    `tags` TEXT NOT NULL,

    UNIQUE INDEX `entryNumber_UNIQUE`(`entryNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pages` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(45) NOT NULL,
    `content` TEXT NOT NULL,
    `excerpt` TEXT NOT NULL,
    `slug` VARCHAR(45) NOT NULL,
    `lastModified` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isEmbed` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    UNIQUE INDEX `slug_UNIQUE`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `posts` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` TEXT NOT NULL,
    `datePublished` DATE NULL,
    `content` LONGTEXT NOT NULL,
    `image` TEXT NULL,
    `contentImages` TEXT NULL,
    `status` ENUM('DRAFT', 'PROTECTED', 'PRIVATE', 'PUBLISHED') NOT NULL,
    `slug` TEXT NULL,
    `excerpt` TEXT NOT NULL,
    `type` VARCHAR(45) NULL,
    `typeId` INTEGER NULL,
    `createTime` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `domainId` INTEGER UNSIGNED NULL,

    INDEX `type_status_date`(`createTime`, `id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscribers` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(45) NOT NULL,
    `firstname` VARCHAR(45) NULL,
    `lastname` VARCHAR(45) NULL,
    `subscriptions` JSON NOT NULL,
    `token` TEXT NOT NULL,
    `createTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `id_UNIQUE`(`id`),
    UNIQUE INDEX `email_UNIQUE`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wishlist` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `quantity` INTEGER NOT NULL,
    `categoryId` INTEGER NULL,
    `priority` ENUM('HIGH', 'MEDIUM', 'LOW') NOT NULL,
    `visibility` ENUM('PUBLIC', 'PRIVATE') NOT NULL,
    `image` TEXT NOT NULL,
    `href` TEXT NOT NULL,
    `comments` VARCHAR(191) NOT NULL,
    `reservees` JSON NOT NULL,
    `purchaseDate` DATE NULL,
    `createTime` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `wishlist_categoryId_fkey`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wishlist_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `wishlist_categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `wishlist` ADD CONSTRAINT `wishlist_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `wishlist_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
