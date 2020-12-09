import React, { useEffect, useState } from 'react';
import { zDate } from 'zavid-modules';

import { Signature } from 'src/components/image';
import { Paragraph, Title } from 'src/components/text';
import { Fader } from 'src/components/transitioner';
import { redevelopmentDate } from 'src/settings';
import css from 'src/styles/pages/Home.module.scss';

import { HomeField, HomeRow } from '.';

export default ({ content }: IntroductionProps) => {
  const [isLoaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, [isLoaded]);

  return (
    <HomeRow className={css['introduction-wrapper']}>
      <HomeField xl={7}>
        <Fader
          determinant={isLoaded}
          duration={800}
          className={css['introduction-text']}>
          <Title className={css['introduction-welcome']}>
            You&#39;ve arrived. Welcome.
          </Title>
          <Paragraph
            className={css['introduction-message']}
            substitutions={{
              redevelopmentDate: zDate.formatDate(redevelopmentDate)
            }}>
            {content}
          </Paragraph>
        </Fader>
      </HomeField>
      <HomeField xl={5}>
        <Fader determinant={isLoaded} duration={800} delay={600}>
          <Signature className={css['introduction-signature']} />
        </Fader>
      </HomeField>
    </HomeRow>
  );
};

interface IntroductionProps {
  content: string;
}
