import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

import { SignatureImage } from 'components/image';
import { Paragraph } from 'componentsv2/Text';
import Mixins from 'stylesv2/Mixins.styles';
import { COLOR, FONTS } from 'stylesv2/Variables.styles';

export const HomeMain = styled.main`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1em 1.5em;
  width: 100%;
`;

export const HomeRow = styled.section`
  ${Mixins.Responsive(['width', '80%', { lg: '90%', sm: '100%' }])}
  display: block;
  padding: 1em 0;
`;

export const HomeField = styled.div<{ flex?: number }>`
  flex: ${({ flex = 1 }) => `${flex} ${flex}`};
`;

export namespace Introduction {
  export const Section = styled(HomeRow)`
    ${Mixins.Responsive(['width', '80%', { lg: '90%', sm: '100%' }])}
    justify-self: center;
    max-width: 800px;
    padding-bottom: 2em;
  `;

  export const TextContainer = styled.div`
    flex: 1 1;
  `;

  export const Heading = styled.h1`
    font-size: 2.5em;
    margin-block: 0;
  `;

  export const Text = styled(Paragraph)`
    font-size: 1.2em;
  `;

  export const Signature = styled(SignatureImage)`
    ${Mixins.Responsive([
      'width',
      '300px',
      { lg: '250px', md: '200px', sm: '150px' },
    ])}
    float: right;
    margin: 1em;
  `;
}

export namespace Latest {
  export const Article = styled.article`
    border-top: 1px solid ${COLOR.WHITE};
    max-width: 800px;
    padding-block: 2em;
    width: 100%;
  `;

  export const Label = styled.label`
    font-family: ${FONTS.BODY};
  `;

  export const Title = styled.h2`
    font-family: ${FONTS.TITLE};
    font-size: 2em;
    margin-block: 0.2em;
  `;

  export const Date = styled.time`
    font-family: ${FONTS.BODY};
  `;

  export const Excerpt = styled(Paragraph)`
    font-size: 1.2em;
  `;

  export const Feather = styled(FontAwesomeIcon)`
    float: right;
    font-size: 5em;
  `;
}
