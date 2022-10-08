import styled from 'styled-components';

import { FONTS } from 'stylesv2/Variables.styles';

namespace TextStyle {
  export const Collection = styled.pre`
    font-family: ${FONTS.BODY};
    white-space: pre-wrap;
  `;

  export namespace Section {
    export const Paragraph = styled.p`
      display: block;
      line-height: 1.6;
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
