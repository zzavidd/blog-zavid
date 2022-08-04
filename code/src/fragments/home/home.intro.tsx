import React from 'react';
import { zDate } from 'zavid-modules';

import { Signature } from 'src/components/image';
import { HomeRow, HomeField } from 'src/components/pages/home';
import { Paragraph, Title } from 'src/components/text';
import { redevelopmentDate } from 'src/settings';
import css from 'src/styles/pages/Home.module.scss';

export default ({ content, emailSubCount }: IntroductionProps) => {
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
              redevelopmentDate: zDate.formatDate(redevelopmentDate),
              emailSubCount
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
};

type IntroductionProps = {
  content: string;
  emailSubCount: number;
};