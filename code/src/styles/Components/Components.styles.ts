import Link from 'next/link';
import styled, { css } from 'styled-components';

import { FONTS } from 'styles/Variables.styles';

namespace CPX {
  export const Button = styled.button.attrs({ type: 'button' })`
    border-style: none;
    cursor: pointer;
    font-family: 'Mulish', sans-serif;
    transition: all 0.3s;
    user-select: none;
    outline: none;
  `;

  export const IconButton = styled.button.attrs({ type: 'button' })`
    background-color: antiquewhite;
    user-select: none;
    transition: all 0.3s;
  `;

  export const Clickable = styled.button.attrs({ type: 'button' })`
    background: none;
    border-style: none;
    outline: none;
    cursor: ${({ onClick }) => (onClick ? 'pointer' : 'auto')};

    svg {
      color: ${({ theme }) => theme.bodyFontColor};
      font-size: 1.2em;
      pointer-events: none;
    }
  `;

  export const Checkbox = styled.label<{ checked: boolean }>`
    align-items: center;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    display: flex;
    font-family: ${FONTS.BODY};
    font-size: 0.9em;
    max-width: fit-content;
    min-width: 70px;
    transition: all 0.3s;

    span {
      font-weight: bold;
      margin-left: 0.4em;
    }

    polyline {
      transition: all 0.2s;
      ${({ checked }) =>
        checked
          ? css`
              opacity: 1;
            `
          : css`
              opacity: 0;
            `}
    }
  `;

  export const Hyperlink = styled(Link)`
    text-decoration: none;
  `;
}

export default CPX;
