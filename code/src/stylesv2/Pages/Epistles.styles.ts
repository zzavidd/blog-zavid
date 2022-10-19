import styled, { keyframes } from 'styled-components';

import { Paragraph } from 'componentsv2/Text';
import Mixins from 'stylesv2/Mixins.styles';
import { COLOR, FONTS } from 'stylesv2/Variables.styles';

const pulse = keyframes`
    0%,100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.04);
    }
  `;

namespace EpistleStyle {
  export const Container = styled.div`
    padding: 2em;
  `;

  export const Main = styled.main`
    align-items: center;
    display: flex;
    flex-direction: column;
  `;

  export const Header = styled.section`
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.bodyFontColor};
    display: flex;
    flex-direction: column;
    max-width: 650px;
    padding: 1em;
  `;

  export const PageHeading = styled.h1`
    font-size: 2.4em;
    margin: 0;
    text-align: center;
    text-transform: uppercase;
  `;

  export const PageSummary = styled(Paragraph)`
    ${Mixins.Responsive(['font-size', '1.2em', { sm: '1em' }])}
    text-align: center;

    p {
      margin: 0.5em 0;
    }
  `;

  export const Grid = styled.section`
    ${Mixins.Responsive(
      ['padding', '1.5em', { sm: '1em 0' }],
      ['gap', '0.6em', { sm: '1em' }],
    )}
    display: flex;
    flex-wrap: wrap;
  `;

  export const Entry = styled.a`
    border-radius: 10px;
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bodyFontColor};
    display: block;
    flex: 1 1 400px;
    flex-direction: column;
    height: 300px;
    overflow: hidden;
    position: relative;
    width: 200px;

    img {
      transition: all 0.3s;
    }

    &:hover {
      img {
        animation: ${pulse} 1s ease 0s infinite normal both;
        width: 100%;
      }
    }
  `;

  export const EntryLabel = styled.div`
    background-color: rgba(0, 0, 0, 0.8);
    bottom: 0;
    color: ${COLOR.WHITE};
    padding: 1em;
    position: absolute;
    width: 100%;
  `;

  export const EntryHeading = styled.h2`
    ${Mixins.Responsive(['font-size', '1.5em', { sm: '1.4em' }])}
    font-family: ${FONTS.TITLE};
    margin: 0;
  `;

  export const EntryContent = styled(Paragraph)`
    ${Mixins.Responsive(['font-size', '1em', { sm: '0.9em' }])}
    margin: 0.5em 0;

    p {
      margin: 0;
    }
  `;
}

export default EpistleStyle;
