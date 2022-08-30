import React from 'react';
import { zDate } from 'zavid-modules';

import type { DiaryDAO } from 'classes';
import { Flexer } from 'components/layout';
import { Icon } from 'components/library';
import { Paragraph, Title } from 'components/text';
import css from 'styles/pages/Home.module.scss';

export default function HomeDiary({ entry }: LatestDiaryEntryProps) {
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
}

interface LatestDiaryEntryProps {
  entry: DiaryDAO;
}
