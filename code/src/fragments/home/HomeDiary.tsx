import { faFeatherAlt } from '@fortawesome/free-solid-svg-icons';
import { zDate } from 'zavid-modules';

import type { DiaryDAO } from 'classes/diary/DiaryDAO';
import ZDate from 'lib/date';
import * as Styles from 'stylesv2/Pages/Home.styles';

export default function HomeDiary({ entry }: LatestDiaryEntryProps) {
  if (!entry) return null;

  const date = zDate.formatDate(entry.date, { withWeekday: true });
  return (
    <Styles.Latest.Article>
      <Styles.Latest.Feather icon={faFeatherAlt} />
      <Styles.Latest.Label>Latest Diary Entry:</Styles.Latest.Label>
      <Styles.Latest.Title>
        Diary Entry #{entry.entryNumber}: {entry.title}
      </Styles.Latest.Title>
      <Styles.Latest.Date dateTime={ZDate.formatISO(entry.date)}>
        {date}
      </Styles.Latest.Date>
      <Styles.Latest.Excerpt
        truncate={80}
        more={{
          text: 'Read my latest diary entry...',
          href: `/diary/${entry.entryNumber}`,
        }}>
        {entry.content}
      </Styles.Latest.Excerpt>
    </Styles.Latest.Article>
  );
}

interface LatestDiaryEntryProps {
  entry: DiaryDAO;
}
