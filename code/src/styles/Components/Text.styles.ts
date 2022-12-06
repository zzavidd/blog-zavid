import styled from 'styled-components';

import { FONTS } from 'styles/Variables.styles';

namespace TextStyle {
  export const Collection = styled.pre`
    display: flex;
    flex-direction: column;
    font-family: ${FONTS.BODY};
    margin: 0;
    white-space: pre-wrap;
    width: 100%;
  `;

  export namespace Section {
    export const Paragraph = styled.p`
      line-height: 1.6;
      margin-block: 0.8em;
    `;

    export const Image = styled.img`
      display: block;
      max-height: 400px;
      object-fit: contain;
      width: 100%;
    `;

    export const Audio = styled.audio`
      align-self: center;
      display: block !important;
      margin-block: 0.5em;
      max-width: 300px;
      width: 100%;

      &::-webkit-media-controls-enclosure {
        background-color: #a5a5a5;
        border-radius: 7px;
      }

      &::-webkit-media-controls-current-time-display,
      &::-webkit-media-controls-time-remaining-display {
        text-shadow: none;
      }
    `;

    export const Blockquote = styled.blockquote`
      border-left: 5px solid ${({ theme }) => theme.fadedFontColor};
      border-radius: 5px;
      color: ${({ theme }) => theme.bodyFontColor};
      line-height: 1.6;
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
      pointer-events: auto;
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
    export const Anchor = styled.a.attrs({ rel: 'noopener noreferrer' })`
      color: ${({ theme }) => theme.hyperlink};
      cursor: pointer;
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
