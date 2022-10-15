import styled from 'styled-components';

import { FONTS } from 'stylesv2/Variables.styles';

namespace TextStyle {
  export const Collection = styled.pre`
    font-family: ${FONTS.BODY};
    margin: 0;
    white-space: pre-wrap;
  `;

  export namespace Section {
    export const Paragraph = styled.p`
      display: block;
      line-height: 1.6;
      margin-block: 1.5em;
    `;

    export const BlockImage = styled.img`
      display: block;
      max-height: 400px;
      object-fit: contain;
      width: 100%;
    `;

    export const Blockquote = styled.blockquote`
      border-left: 5px solid ${({ theme }) => theme.fadedFontColor};
      border-radius: 5px;
      color: ${({ theme }) => theme.bodyFontColor};
      margin: 0;
      padding: 0.5em 1.5em;
    `;

    export const OrderedList = styled.ol<{ spaced: boolean }>`
      padding-inline-start: 1.5em;

      li {
        line-height: 1.6;
        padding-block: ${({ spaced }) => (spaced ? '0.5em' : 0)};
        padding-left: 1em;
      }
    `;

    export const UnorderedList = styled.ul<{ spaced: boolean }>`
      padding-inline-start: 1.5em;

      li {
        line-height: 1.6;
        padding-block: ${({ spaced }) => (spaced ? '0.5em' : 0)};
        padding-left: 1em;
      }
    `;

    export const ReadMore = styled.a`
      color: ${({ theme }) => theme.readmore};
      cursor: pointer;
      font-family: ${FONTS.BODY};
      line-height: 140%;
      text-decoration: none;

      svg {
        margin-right: 0.4em;
      }

      &:hover {
        text-decoration: underline;
      }
    `;
  }

  export namespace Emphasis {
    export const Anchor = styled.a`
      color: ${({ theme }) => theme.hyperlink};
      font-weight: bold;
      text-decoration: none;
      transition: all 0.3s;

      &:hover {
        text-decoration: underline;
      }
    `;
  }
}

export default TextStyle;
