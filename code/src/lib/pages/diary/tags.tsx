import classnames from 'classnames';
import React from 'react';
import { useSelector, RootStateOrAny } from 'react-redux';
import { zString } from 'zavid-modules';

import { VanillaLink } from 'src/components/text';
import css from 'src/styles/pages/Posts.module.scss';

// TODO: Use better tags; convertCSVToArray should be createTags, producing
// tag labels and values
export default ({
  tags,
  limit,
  className,
  tagClassName,
  asCSV
}: DiaryTagProps) => {
  if (!tags) return null;

  const theme = useSelector(({ theme }: RootStateOrAny) => theme);

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
              tagClassName
            )}
            key={key}>
            #{tag}
          </VanillaLink>
        );
      })}
    </div>
  );
};

type DiaryTagProps = {
  tags: string | string[];
  limit?: number;
  className?: string;
  tagClassName?: string;
  asCSV?: boolean;
};
