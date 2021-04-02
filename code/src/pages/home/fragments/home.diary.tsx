import React from 'react';
import { zDate } from 'zavid-modules';

import { DiaryDAO } from 'classes';
import { Flexer } from 'src/components/layout';
import { Paragraph, Title } from 'src/components/text';
import { Icon } from 'src/lib/library';
import css from 'src/styles/pages/Home.module.scss';

export default ({ entry }: LatestDiaryEntryProps) => {
  if (!entry) return null;

  const date = zDate.formatDate(entry.date!, { withWeekday: true });
  return (
    <div className={css['latest-diary']}>
      <Flexer>
        <div>
          <div className={css['latest-shared-heading']}>
            Latest Diary Entry:
          </div>
          <Title className={css['latest-diary-title']}>
            Diary Entry #{entry.entryNumber}: {entry.title}
          </Title>
          <div className={css['latest-diary-date']}>{date}</div>
        </div>
        <Icon name={'feather-alt'} className={css['latest-diary-feather']} />
      </Flexer>
      <Paragraph
        className={css['latest-diary-content']}
        truncate={80}
        moreclass={css['latest-diary-readmore']}
        moretext={'Read my latest diary entry...'}
        morelink={`/diary/${entry.slug}`}>
        {entry.content}
      </Paragraph>
    </div>
  );
};

type LatestDiaryEntryProps = {
  entry: DiaryDAO;
};
