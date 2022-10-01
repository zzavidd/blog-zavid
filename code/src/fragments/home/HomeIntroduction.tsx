import { zDate } from 'zavid-modules';

import { SignatureImage } from 'components/image';
import { Paragraph } from 'components/text';
import { BLOG_REDEVELOPMENT_DATE } from 'constants/settings';
import css from 'styles/pages/Home.module.scss';
import * as Styles from 'stylesv2/Pages/Home.styles';

export default function HomeIntroduction({
  content,
  emailSubCount,
}: IntroductionProps) {
  return (
    <Styles.Introduction.Section>
      <Styles.Introduction.TextContainer>
        <Styles.Introduction.Heading>
          You&#39;ve arrived. Welcome.
        </Styles.Introduction.Heading>
        <Styles.Introduction.Signature />
        <Paragraph
          className={css['introduction-text__message']}
          substitutions={{
            redevelopmentDate: zDate.formatDate(BLOG_REDEVELOPMENT_DATE),
            emailSubCount,
          }}>
          {content}
        </Paragraph>
      </Styles.Introduction.TextContainer>
    </Styles.Introduction.Section>
  );
}

interface IntroductionProps {
  content: string;
  emailSubCount: number;
}
