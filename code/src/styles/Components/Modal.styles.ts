import styled, { css } from 'styled-components';

import Mixins from 'styles/Mixins.styles';
import type { ButtonVariant } from 'styles/Variables.styles';
import { COLOR } from 'styles/Variables.styles';

import CPX from './Components.styles';

namespace ModalStyle {
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
    ${({ theme, variant }) =>
      Mixins.ClickBehavior(theme.button[variant], {
        hover: 0.1,
        active: 0.15,
      })}
    border-radius: 20px;
    box-shadow: 0 0 1px 1px ${({ theme }) => theme.bodyFontColor};
    color: ${({ theme }) => theme.bodyFontColor};
    font-size: 0.9em;
    min-width: 150px;
    padding: 1em;
  `;
}

export default ModalStyle;