import { faFeatherAlt } from '@fortawesome/free-solid-svg-icons';

import ZDate from 'lib/date';
import * as Style from 'styles/Pages/Home.styles';

export default function HomeDiary({ entry }: LatestDiaryEntryProps) {
  if (!entry) return null;

  return (
    <Style.Latest.Article>
      <Style.Latest.DiaryIcon icon={faFeatherAlt} />
      <Style.Latest.Label>Latest Diary Entry:</Style.Latest.Label>
      <Style.Latest.Title>
        Diary Entry #{entry.entryNumber}: {entry.title}
      </Style.Latest.Title>
      <Style.Latest.Date dateTime={ZDate.formatISO(entry.date)}>
        {ZDate.format(entry.date)}
      </Style.Latest.Date>
      <Style.Latest.Excerpt
        truncate={50}
        more={{
          text: 'Read my latest diary entry...',
          href: `/diary/${entry.entryNumber}`,
        }}>
        {entry.content}
      </Style.Latest.Excerpt>
    </Style.Latest.Article>
  );
}

interface LatestDiaryEntryProps {
  entry: DiaryDAO | undefined;
}
