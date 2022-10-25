import { faBookOpen } from '@fortawesome/free-solid-svg-icons';

import type { PostDAO } from 'classes/posts/PostDAO';
import ZDate from 'lib/date';
import * as Style from 'styles/Pages/Home.styles';

export default function HomeReverie({ reverie }: HomeReverieProps) {
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
            layout={'responsive'}
            width={16}
            height={9}
            objectFit={'contain'}
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

interface HomeReverieProps {
  reverie: PostDAO;
}
