import { faBookOpen } from '@fortawesome/free-solid-svg-icons';

import Loader from 'components/Loader';
import ZDate from 'lib/date';
import * as Style from 'styles/Pages/Home.styles';

export default function HomeReverie({ reverie }: HomeReverieProps) {
  if (!reverie) return <Placeholder />;

  return (
    <Style.Latest.Article>
      <Style.Latest.ReverieIcon icon={faBookOpen} />
      <Style.Latest.Label>Latest Reverie:</Style.Latest.Label>
      <Style.Latest.Title>{reverie.title}</Style.Latest.Title>
      <Style.Latest.Date dateTime={ZDate.formatISO(reverie.datePublished)}>
        {ZDate.format(reverie.datePublished)}
      </Style.Latest.Date>
      {reverie.image ? (
        <Style.Latest.ImageBox>
          <Style.Latest.Image
            src={reverie.image as string}
            alt={reverie.title}
            placeholder={'blur'}
            blurDataURL={reverie.imagePlaceholder}
            width={16}
            height={9}
          />
        </Style.Latest.ImageBox>
      ) : null}
      <Style.Latest.Excerpt
        truncate={50}
        more={{
          text: 'Read my latest reverie...',
          href: `/reveries/${reverie.slug}`,
        }}>
        {reverie.content}
      </Style.Latest.Excerpt>
    </Style.Latest.Article>
  );
}

function Placeholder() {
  return (
    <Style.Latest.Article>
      <Style.Latest.Label>Latest Reverie:</Style.Latest.Label>
      <Loader viewBox={'0 0 200 90'}>
        <rect x={0} y={2} rx={2} width={95} height={10} />
        <rect x={0} y={15} rx={2} width={50} height={6} />
        <rect x={0} y={30} rx={2} width={90} height={6} />
        <rect x={0} y={39} rx={2} width={100} height={6} />
        <rect x={0} y={48} rx={2} width={100} height={6} />
        <rect x={0} y={57} rx={2} width={100} height={6} />
        <rect x={0} y={66} rx={2} width={90} height={6} />
        <rect x={0} y={75} rx={2} width={90} height={6} />
        <rect x={110} y={30} rx={5} width={90} height={50} />
      </Loader>
    </Style.Latest.Article>
  );
}

interface HomeReverieProps {
  reverie: PostDAO | undefined;
}
