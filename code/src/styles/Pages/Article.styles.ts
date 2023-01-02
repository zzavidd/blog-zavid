import { transparentize } from 'polished';
import styled, { css } from 'styled-components';

import { SignatureImage } from 'components/Image';
import { Paragraph } from 'components/Text';
import Mixins from 'styles/Mixins.styles';
import { COLOR, SIZES } from 'styles/Variables.styles';

const CurrentPreviousStyles = css`
  &:hover {
    text-decoration: underline;
    svg {
      border-bottom: 1px solid ${({ theme }) => theme.Color.Font.Body};
    }
  }

  &:active {
    color: ${({ theme }) => theme.Color.Font.Faded};
  }
`;

namespace ArticleStyle {
  export const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    user-select: none;
  `;

  export const Layout = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
  `;

  export const Main = styled.main`
    ${Mixins.Responsive(['align-items', 'center', { sm: 'flex-start' }])}
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;
    max-width: 650px;
    padding: 2em 1.5em;
  `;

  export const Title = styled.h1`
    ${Mixins.Responsive(
      ['font-size', '2em', { sm: '1.8em' }],
      ['text-align', 'center', { sm: 'left' }],
    )}
    font-size: 2em;
    margin: 0.2em 0;
    text-align: center;
  `;

  export const Date = styled.time`
    ${Mixins.Responsive(
      ['font-size', '0.85em', { sm: '0.8em' }],
      ['text-align', 'center', { sm: 'left' }],
    )}
    font-family: ${({ theme }) => theme.Font.Body};
    font-size: 0.85em;
    width: 100%;
  `;

  export const ImageBox = styled.div`
    border-radius: 10px;
    margin-block: 1em 0;
    overflow: hidden;
    width: 100%;
  `;

  export const Content = styled(Paragraph)`
    ${Mixins.Responsive(['font-size', '1.25em', { sm: '1em' }])}

    p {
      line-height: 1.7;
      user-select: none;
    }
  `;

  export const Signature = styled(SignatureImage)`
    margin-block: 0.5em;
    position: relative;
    width: 100%;
  `;

  export const TagBlock = styled.ul`
    display: flex;
    flex-wrap: wrap;
    gap: 0.1em 0.5em;
    list-style-type: none;
    padding: 0;
  `;

  export const Tag = styled.li`
    a {
      color: ${({ theme }) => theme.Color.Font.Faded};
      font-family: ${({ theme }) => theme.Font.Body};
      font-size: 0.9em;
      font-style: italic;
      font-weight: bold;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  `;

  export const FavouriteNotice = styled.div`
    ${Mixins.Responsive(['font-size', '0.9em', { sm: '0.85em' }])}
    display: flex;
    font-family: ${({ theme }) => theme.Font.Body};
    gap: 0.4em;
    margin-block: 0.5em;
  `;

  export const BackLinkBox = styled.div`
    bottom: 0;
    padding: 1em;
    position: sticky;
  `;

  export const BackLink = styled.a`
    color: ${({ theme }) => theme.Color.Font.Body};
    font-family: ${({ theme }) => theme.Font.Body};
    font-weight: bold;
    text-decoration: none;

    svg {
      margin-right: 0.4em;
    }

    &:hover {
      text-decoration: underline;

      svg {
        border-bottom: 1px solid ${({ theme }) => theme.Color.Font.Body};
      }
    }
  `;

  export const TopNavigator = styled.header`
    ${Mixins.Responsive(
      ['grid-template-columns', 'repeat(3, 1fr)', { sm: 'repeat(2, 1fr)' }],
      ['top', 0, { sm: SIZES.HEADER_HEIGHT }],
    )}
    background-color: ${({ theme }) =>
      transparentize(0.05, theme.Color.Background.Header)};
    box-shadow: 0 0 2px 0 ${COLOR.BLACK};
    display: grid;
    position: sticky;
    top: 0;
    width: 100%;
    z-index: 1;
  `;

  export const Footer = styled.section`
    border-top: 1px solid ${({ theme }) => theme.Color.Font.Body};
    margin-top: 1em;
    padding-top: 1em;
    width: 100%;
  `;

  export const TopNavigatorContent = styled.a<TopNavigatorContentProps>`
    ${({ direction }) => {
      switch (direction) {
        case 'previous': {
          return css`
            display: flex;
            flex-direction: row;
            text-align: left;
            ${CurrentPreviousStyles};
          `;
        }
        case 'next': {
          return css`
            display: flex;
            flex-direction: row-reverse;
            text-align: right;
            ${CurrentPreviousStyles};
          `;
        }
        case 'current':
        default: {
          return css`
            flex-direction: row-reverse;
            justify-self: center;
            text-align: center;
            ${Mixins.Responsive(['display', 'flex', { sm: 'none' }])}
          `;
        }
      }
    }};
    align-items: center;
    color: ${({ theme }) => theme.Color.Font.Body};
    gap: 1em;
    overflow: hidden;
    padding: 1em;
    position: sticky;
    text-decoration: none;
    top: 0;
    transition: color 0.3s;

    svg {
      padding-bottom: 0.1em;
    }
  `;

  export const TopNavigatorText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.2em;

    h6 {
      ${Mixins.Responsive(
        ['font-size', '0.9em', { sm: '0.6em' }],
        ['letter-spacing', '0px', { sm: '-0.5px' }],
      )}
      font-family: ${({ theme }) => theme.Font.Title};
      margin: 0;
    }

    p {
      ${Mixins.Responsive(['font-size', '0.9em', { sm: '0.7em' }])}
      margin: 0;
    }
  `;

  export const BottomNavigator = styled.div`
    background-color: ${({ theme }) =>
      transparentize(0.05, theme.Color.Background.Header)};
    bottom: 0;
    box-shadow: 0 0 2px 0 ${COLOR.BLACK};
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    ${Mixins.Responsive(['font-size', '1em', { sm: '0.9em' }])}
    position: sticky;
    width: 100%;
  `;
}

export default ArticleStyle;

interface TopNavigatorContentProps {
  direction: 'current' | 'previous' | 'next';
}
