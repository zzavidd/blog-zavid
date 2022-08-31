import React from 'react';
import { zDate } from 'zavid-modules';

import { Signature } from 'components/image';
import { HomeRow, HomeField } from 'components/pages/home';
import { Paragraph, Title } from 'components/text';
import { BLOG_REDEVELOPMENT_DATE } from 'constants/settings';
import css from 'styles/pages/Home.module.scss';

export default function HomeIntroduction({
  content,
  emailSubCount,
}: IntroductionProps) {
  return (
    <HomeRow className={css['introduction-wrapper']}>
      <HomeField xl={7}>
        <div className={css['introduction-text']}>
          <Title className={css['introduction-text__heading']}>
            You&#39;ve arrived. Welcome.
          </Title>
          <Paragraph
            className={css['introduction-text__message']}
            substitutions={{
              redevelopmentDate: zDate.formatDate(BLOG_REDEVELOPMENT_DATE),
              emailSubCount,
            }}>
            {content}
          </Paragraph>
        </div>
      </HomeField>
      <HomeField xl={5}>
        <Signature className={css['introduction-signature']} />
      </HomeField>
    </HomeRow>
  );
}

interface IntroductionProps {
  content: string;
  emailSubCount: number;
}
