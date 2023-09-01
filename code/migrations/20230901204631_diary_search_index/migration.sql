-- CreateIndex
CREATE FULLTEXT INDEX `diary_title_content_footnote_idx` ON `diary`(`title`, `content`, `footnote`);
