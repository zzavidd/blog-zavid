import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

import { Paragraph } from 'components/Text';
import TextStyle from 'styles/Components/Text.styles';
import Mixins from 'styles/Mixins.styles';
import { FONTS } from 'styles/Variables.styles';

import ArticleStyle from './Article.styles';

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

  export const PageHeading = styled.h1`
    ${Mixins.Responsive(['font-size', '2.4em', { sm: '1.8em' }])}
    font-family: ${FONTS.TITLE};
    margin: 0.5em 0 0;
    text-align: center;
    text-transform: uppercase;
  `;

  export const PageSummary = styled(Paragraph)`
    ${Mixins.Responsive(['font-size', '1.1em', { sm: '0.9em' }])}
    border-bottom: 1px solid ${({ theme }) => theme.bodyFontColor};
    margin: 0 1em;
    max-width: 700px;
    padding-block: 1em;
    text-align: center;

    p {
      margin: 0;
    }
  `;

  export const NoContentMessage = styled.p`
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
  `;

  export const Grid = styled.section`
    ${Mixins.Responsive(
      ['padding', '1em', { sm: '1em 0' }],
      ['gap', '0.5em', { lg: '1em', sm: 0 }],
    )}
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
    font-size: 0.8em;
  `;

  export const EntryTitle = styled.h2`
    font-family: ${FONTS.TITLE};
    font-size: 1.5em;
    margin-block: 0.2em;
  `;

  export const EntryExcerpt = styled(Paragraph)`
    ${Mixins.Responsive(['font-size', '1em', { sm: '0.95em' }])}
  `;

  export const EntryStar = styled(FontAwesomeIcon)`
    float: right;
    font-size: 2.5em;
  `;

  export const Entry = styled.article`
    ${Mixins.Responsive(
      ['border-bottom-width', '0', { md: '1px' }],
      ['padding', '1.5em', { lg: '1em 0', sm: '1em' }],
      ['pointer-events', 'auto', { lg: 'none' }],
    )};
    border-bottom-color: ${({ theme }) => theme.bodyFontColor};
    border-bottom-style: solid;
    cursor: pointer;
    position: relative;
    transition: all 0.3s;

    &:hover {
      background-color: ${({ theme }) => theme.fadedFontColor};
      border-radius: 10px;
      color: ${({ theme }) => theme.bodyFontColorReverse};

      ${TextStyle.Section.ReadMore} {
        color: ${({ theme }) => theme.readmoreReverse};
      }

      ${ArticleStyle.Tag} a {
        color: ${({ theme }) => theme.fadedFontColorReverse};
      }
    }
  `;
}

export default DiaryStyle;
