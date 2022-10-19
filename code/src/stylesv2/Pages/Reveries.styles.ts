import styled from 'styled-components';

import { Paragraph } from 'componentsv2/Text';
import Mixins from 'stylesv2/Mixins.styles';
import { FONTS } from 'stylesv2/Variables.styles';

namespace ReverieStyle {
  export const Container = styled.div`
    display: flex;
    padding: 1em;
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
    ${Mixins.Responsive(['padding', '1.5em', { sm: '1em 0' }])}
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
  `;

  export const Entry = styled.article`
    display: flex;
    flex: 1 1 400px;
    flex-direction: column;
    gap: 0.5em;
    max-width: 650px;
    padding: 1em;
  `;

  export const EntryHeading = styled.h2`
    font-family: ${FONTS.TITLE};
    font-size: 1.8em;
    margin: 0;
  `;

  export const EntryDate = styled.time`
    font-family: ${FONTS.BODY};
    font-size: 0.85em;
    padding-block: 0.4em;
  `;

  export const EntryContent = styled(Paragraph)`
    ${Mixins.Responsive(['font-size', '1.3em', { sm: '1.15em' }])}
    margin: 0;
  `;

  export const ImageBox = styled.a`
    border-radius: 10px;
    display: block;
    overflow: hidden;
    padding-bottom: 56.25%;
    position: relative;
    width: 100%;
  `;
}

export default ReverieStyle;
