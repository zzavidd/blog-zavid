import classnames from 'classnames';
import React from 'react';

import { DiaryDAO } from 'classes';
import { VanillaLink } from 'src/components/text';
import css from 'src/styles/pages/Posts.module.scss';

export default ({
  diaryEntry,
  limit,
  className,
  tagClassName
}: DiaryTagProps) => {
  if (!diaryEntry.tags) return null;

  let tags = [];

  if (typeof diaryEntry.tags === 'string') {
    tags = JSON.parse(diaryEntry.tags).slice(0, limit);
  } else {
    tags = (diaryEntry.tags as string[]).slice(0, limit);
  }

  return (
    <div className={classnames(css['post-tag-block'], className)}>
      {tags.map((tag: string, key: number) => {
        return (
          <VanillaLink href={`/search?term=${tag}`} key={key}>
            <span className={classnames(css[`post-tag`], tagClassName)}>#{tag}</span>
          </VanillaLink>
        );
      })}
    </div>
  );
};

type DiaryTagProps = {
  diaryEntry: DiaryDAO;
  limit?: number;
  className?: string;
  tagClassName?: string;
};
