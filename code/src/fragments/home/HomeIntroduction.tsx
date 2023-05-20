import { Typography } from '@mui/material';

import Settings from 'constants/settings';
import ZDate from 'lib/date';
import * as Styles from 'styles/Pages/Home.styles';

export default function HomeIntroduction({
  content,
  emailSubCount,
}: IntroductionProps) {
  return (
    <Styles.Introduction.Section>
      <Styles.Introduction.TextContainer>
        <Typography variant={'h1'}>
          {Settings.SITE_TITLE}: {Settings.SITE_TAGLINE}
        </Typography>
        <Styles.Introduction.Signature />
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
