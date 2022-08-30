import classnames from 'classnames';
import React from 'react';
import type { RootStateOrAny } from 'react-redux';
import { useSelector } from 'react-redux';
import { zString } from 'zavid-modules';

import { VanillaLink } from 'components/text';
import css from 'styles/pages/Posts.module.scss';

// TODO: Use better tags; convertCSVToArray should be createTags, producing
// tag labels and values
export default function DiaryTags({
  tags,
  limit,
  className,
  tagClassName,
  asCSV,
}: DiaryTagProps) {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  if (!tags) return null;

  let tagsList: Array<string> = [];

  if (typeof tags === 'string') {
    if (asCSV) {
      tagsList = zString.convertCsvToArray(tags).slice(0, limit);
    } else {
      tagsList = JSON.parse(tags).slice(0, limit);
    }
  } else {
    tagsList = (tags as string[]).slice(0, limit);
  }

  return (
    <div className={classnames(css['post-tag-block'], className)}>
      {tagsList.map((tag: string, key: number) => {
        tag = tag.replace(/\s/, '');
        return (
          <VanillaLink
            href={`/search?term=${tag}`}
            className={classnames(
              css['post-tag'],
              css[`post-tag-${theme}`],
              tagClassName,
            )}
            key={key}>
            #{tag}
          </VanillaLink>
        );
      })}
    </div>
  );
}

interface DiaryTagProps {
  tags: string | string[];
  limit?: number;
  className?: string;
  tagClassName?: string;
  asCSV?: boolean;
}
