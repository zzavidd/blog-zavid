import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

import { Paragraph } from 'componentsv2/Text';
import TextStyle from 'stylesv2/Components/Text.styles';
import Mixins from 'stylesv2/Mixins.styles';
import { FONTS } from 'stylesv2/Variables.styles';

namespace DiaryStyle {
  export const Container = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
  `;

  export const Main = styled.main`
    align-items: center;
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;
    padding: 1em;
  `;

  export const Heading = styled.h1`
    ${Mixins.Responsive(['font-size', '2.4em', { sm: '1.8em' }])}
    font-family: ${FONTS.TITLE};
    margin: 0.5em 0 0;
    text-align: center;
    text-transform: uppercase;
  `;

  export const Summary = styled(Paragraph)`
    ${Mixins.Responsive(['font-size', '1.1em', { sm: '0.9em' }])}
    border-bottom: 1px solid ${({ theme }) => theme.bodyFontColor};
    margin: 0 1em;
    max-width: 700px;
    padding-block: 1em;
    text-align: center;
  `;

  export const NoContentMessage = styled.p`
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
  `;

  export const Grid = styled.section`
    ${Mixins.Responsive(['padding', '1em', { sm: 0 }])}
    display: grid;
    gap: 0.5em;
    grid-template-columns: repeat(auto-fill, minmax(300px, auto));
  `;

  export const EntryDetails = styled.a`
    color: inherit;
    text-decoration: none;
  `;

  export const EntryDate = styled.time`
    font-family: ${FONTS.BODY};
    font-size: 0.9em;
  `;

  export const EntryTitle = styled.h2`
    font-family: ${FONTS.TITLE};
    margin-block: 0.2em;
  `;

  export const EntryExcerpt = styled(Paragraph)`
    font-size: 1.1em;
  `;

  export const EntryStar = styled(FontAwesomeIcon)`
    float: right;
    font-size: 2.5em;
  `;

  export const EntryTagBlock = styled.ul`
    display: flex;
    flex-wrap: wrap;
    gap: 0.1em 0.5em;
    list-style-type: none;
    padding: 0;
  `;

  export const EntryTag = styled.li`
    a {
      color: ${({ theme }) => theme.fadedFontColor};
      font-family: ${FONTS.BODY};
      font-size: 0.9em;
      font-style: italic;
      font-weight: bold;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  `;

  export const Entry = styled.article`
    ${Mixins.Responsive(['padding', '1.5em', { sm: '1em' }])}
    border-radius: 10px;
    cursor: pointer;
    position: relative;
    transition: all 0.3s;

    &:hover {
      background-color: ${({ theme }) => theme.fadedFontColor};
      color: ${({ theme }) => theme.bodyFontColorReverse};

      ${TextStyle.Section.ReadMore} {
        color: ${({ theme }) => theme.readmoreReverse};
      }

      ${EntryTag} a {
        color: ${({ theme }) => theme.fadedFontColorReverse};
      }
    }
  `;
}

export default DiaryStyle;
