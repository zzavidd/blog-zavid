import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    border-top: 1px solid ${COLOR.WHITE};
    max-width: 800px;
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

  export const Feather = styled(FontAwesomeIcon)`
    float: right;
    font-size: 5em;
  `;
}

export namespace Aside {
  export const Container = styled.aside`
    ${Mixins.Responsive(['display', 'block', { xl: 'none' }])}
    background-color: #202020;
    border-left: 1px solid ${COLOR.WHITE};
    box-shadow: 0 0 2px 0 ${COLOR.BLACK};
    flex: 1 0 400px;
    height: calc(100vh - 70px);
    overflow-y: auto;
    position: sticky;
    top: 70px;
    z-index: 1;
  `;

  export const HeadingBox = styled.div`
    background: linear-gradient(
      rgba(26, 26, 26, 1) 0%,
      rgba(26, 26, 26, 1) 50%,
      rgba(32, 32, 32, 0.9) 100%
    );
    border-bottom: 1px solid ${COLOR.WHITE};
    box-shadow: 0 0 1px 0 ${COLOR.WHITE};
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
