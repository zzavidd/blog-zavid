import Settings from 'constants/settings';
import ZDate from 'lib/date';
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
        <Styles.Introduction.Signature layout={'responsive'} />
        <Styles.Introduction.Text
          substitutions={{
            redevelopmentDate: ZDate.format(Settings.BLOG_REDEVELOPMENT_DATE),
            emailSubCount,
          }}>
          {content}
        </Styles.Introduction.Text>
      </Styles.Introduction.TextContainer>
    </Styles.Introduction.Section>
  );
}

interface IntroductionProps {
  content: string;
  emailSubCount: number;
}
