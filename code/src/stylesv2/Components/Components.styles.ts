import Link from 'next/link';
import styled, { css } from 'styled-components';

import Mixins from 'stylesv2/Mixins.styles';
import type { ButtonVariant } from 'stylesv2/Variables.styles';
import { COLOR } from 'stylesv2/Variables.styles';

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
    }
  `;

  export const Checkbox = styled.label<{ checked: boolean }>`
    align-items: center;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    display: flex;
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

  export namespace Modal {
    export const Container = styled.div<{ visible: boolean }>`
      ${({ visible }) =>
        Mixins.Visible(visible, {
          whenTrue: css`
            z-index: 5;
          `,
          whenFalse: css`
            z-index: -1;
          `,
        })}
      align-content: center;
      background-color: rgba(0, 0, 0, 0.6);
      display: flex;
      height: 100vh;
      justify-content: center;
      position: fixed;
      transition: all 0.3s;
      width: 100vw;
    `;

    export const Dialog = styled.section`
      align-self: center;
      background-color: ${COLOR.MODAL};
      border-radius: 10px;
      box-shadow: 0 0 2px 0 ${COLOR.BLACK};
      display: flex;
      flex-direction: column;
      font-size: 1.1em;
      height: fit-content;
      margin: 1em;
      max-width: 600px;
      min-height: 200px;
      min-width: 250px;
      width: 100%;
    `;

    export const Header = styled.header`
      padding: 1em;
      width: 100%;
    `;

    export const Body = styled.div`
      flex: 1 1 auto;
      padding: 1.5em;
      width: 100%;
    `;

    export const Footer = styled.footer`
      border-top: 1px solid #808080;
      display: flex;
      flex: 0 1 auto;
      gap: 0.4em;
      justify-content: flex-end;
      padding: 1em;
      width: 100%;
    `;

    export const FooterButton = styled(CPX.Button)<{ variant: ButtonVariant }>`
      ${({ variant }) =>
        Mixins.ClickBehavior(COLOR.BUTTON[variant], {
          hover: 0.1,
          active: 0.15,
        })}
      border-radius: 20px;
      font-size: 0.9em;
      min-width: 150px;
      padding: 1em;
    `;
  }
}

export default CPX;
