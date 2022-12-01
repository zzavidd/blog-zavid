import { faFeatherAlt } from '@fortawesome/free-solid-svg-icons';
import ContentLoader from 'react-content-loader';

import ZDate from 'lib/date';
import * as Style from 'styles/Pages/Home.styles';

export default function HomeDiary({ entry }: LatestDiaryEntryProps) {
  if (!entry) return <Placeholder />;

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

function Placeholder() {
  return (
    <Style.Latest.Article>
      <Style.Latest.Label>Latest Diary Entry:</Style.Latest.Label>
      <ContentLoader
        viewBox={'0 0 200 70'}
        backgroundOpacity={0.7}
        foregroundOpacity={0.9}>
        <rect x={0} y={2} rx={2} width={95} height={10} />
        <rect x={0} y={15} rx={2} width={50} height={6} />
        <rect x={0} y={30} rx={2} width={180} height={6} />
        <rect x={0} y={39} rx={2} width={200} height={6} />
        <rect x={0} y={48} rx={2} width={200} height={6} />
        <rect x={0} y={57} rx={2} width={180} height={6} />
      </ContentLoader>
    </Style.Latest.Article>
  );
}

interface LatestDiaryEntryProps {
  entry: DiaryDAO | undefined;
}
