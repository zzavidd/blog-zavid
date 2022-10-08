import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { darken, transparentize } from 'polished';
import styled from 'styled-components';

import { NextImage, SignatureImage } from 'components/image';
import { Paragraph } from 'componentsv2/Text';
import Mixins from 'stylesv2/Mixins.styles';
import { COLOR, FONTS } from 'stylesv2/Variables.styles';

export const HomePage = styled.div`
  display: flex;
  flex: 1 1 auto;
  position: relative;
`;

export const HomeMain = styled.main`
  align-items: center;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  overflow-y: auto;
  padding: 1em 1.5em;
  width: 100%;
`;

export namespace Introduction {
  export const Section = styled.section`
    ${Mixins.Responsive(['max-width', '800px', { lg: '700px' }])}
    display: block;
    justify-self: center;
    padding: 1em 0 2em;
    width: 100%;
  `;

  export const TextContainer = styled.div`
    flex: 1 1;
  `;

  export const Heading = styled.h1`
    font-size: 2.5em;
    margin-block: 0;
  `;

  export const Text = styled(Paragraph)`
    ${Mixins.Responsive(['font-size', '1.2em', { sm: '1em' }])}
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
    ${Mixins.Responsive(['max-width', '800px', { lg: '700px' }])};
    border-top: 1px solid ${({ theme }) => theme.bodyFontColor};
    padding-block: 2em;
    width: 100%;
  `;

  export const Label = styled.label`
    color: ${({ theme }) => theme.fadedFontColor};
    font-family: ${FONTS.BODY};
    font-size: 0.8em;
    font-style: italic;
    font-weight: bold;
  `;

  export const Title = styled.h2`
    ${Mixins.Responsive(['font-size', '2em', { sm: '1.7em' }])}
    font-family: ${FONTS.TITLE};
    margin-block: 0.1em;
  `;

  export const Date = styled.time`
    font-family: ${FONTS.BODY};
  `;

  export const Excerpt = styled(Paragraph)`
    ${Mixins.Responsive(['font-size', '1.2em', { sm: '1em' }])}
  `;

  export const DiaryIcon = styled(FontAwesomeIcon)`
    float: right;
    font-size: 5em;
    margin-left: 0.3em;
  `;

  export const ReverieIcon = styled(FontAwesomeIcon)`
    ${Mixins.Responsive(
      ['float', 'left', { sm: 'right' }],
      ['margin-inline', '0 0.3em', { sm: '0.3em 0' }],
    )}
    font-size: 5em;
  `;

  export const ImageBox = styled.div`
    ${Mixins.Responsive(['float', 'right', { sm: 'none' }])};
    border-radius: 10px;
    clear: both;
    height: 200px;
    margin-block: 2em;
    max-width: 400px;
    overflow: hidden;
    position: relative;
    width: 100%;
  `;

  export const Image = styled(NextImage)`
    transition: all 0.3s;

    &:hover {
      transform: scale(1.05);
    }
  `;
}

export namespace Aside {
  export const Container = styled.aside`
    ${Mixins.Responsive(['display', 'block', { xl: 'none' }])}
    background-color: ${({ theme }) => theme.headerBackgroundColor};
    border-left: 1px solid ${({ theme }) => theme.bodyFontColor};
    box-shadow: 0 0 2px 0 ${COLOR.BLACK};
    flex: 1 0 400px;
    height: 100vh;
    overflow-y: auto;
    position: sticky;
    top: 0;
    z-index: 1;
  `;

  export const HeadingBox = styled.div`
    background: ${({ theme }) => `linear-gradient(
      ${darken(0.02, theme.headerBackgroundColor)} 0%,
      ${darken(0.02, theme.headerBackgroundColor)} 50%,
      ${transparentize(0.1, theme.headerBackgroundColor)} 100%
    )`};
    display: flex;
    justify-content: center;
    padding: 0.2em 1.5em;
    position: sticky;
    top: 0;
    z-index: 1;
  `;

  export const Heading = styled.h2`
    font-family: ${FONTS.BODY};
    font-size: 0.9em;
    max-width: 250px;
    padding-block: 0.2em;
    text-align: center;
  `;

  export const PostList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 1.5em;
  `;

  export const Post = styled.article`
    display: block;
    width: 100%;
  `;

  export const ImageBox = styled.div`
    border-radius: 10px;
    cursor: pointer;
    height: 200px;
    overflow: hidden;
    position: relative;
  `;

  export const Image = styled(NextImage)`
    transition: all 0.3s;

    &:hover {
      transform: scale(1.05);
    }
  `;

  export const PostDetailsBox = styled.div`
    margin-block: 1em;
  `;

  export const PostTitle = styled.h2`
    font-family: ${FONTS.TITLE};
    font-size: 1.2em;
    margin: 0;
  `;

  export const PostMetadata = styled.p`
    font-size: 0.85em;
    margin-block: 0.4em;
  `;
}
