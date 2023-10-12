-- CreateTable
CREATE TABLE `Mood` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `date` DATE NOT NULL,
    `timeOfDay` ENUM('MORNING', 'EVENING') NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
