import styled from 'styled-components';

import Mixins from 'styles/Mixins.styles';
import type { ButtonVariant } from 'styles/Variables.styles';
import { FONTS } from 'styles/Variables.styles';

import CPX from './Components.styles';

export namespace CuratorStyle {
  export const CanvasBox = styled.div`
    display: flex;
    justify-content: center;
  `;

  export const Canvas = styled.canvas`
    display: block;
    max-height: 60vh;
    max-width: 100%;
  `;

  export const SettingsBox = styled.section`
    ${Mixins.Responsive(['font-size', '1em', { sm: '0.7em' }])}
    display: flex;
    flex-direction: column;
    font-family: ${FONTS.BODY};
    gap: 1em;
    padding-block: 1em;
  `;

  export const FooterButton = styled(CPX.Button)<{ variant: ButtonVariant }>`
    ${({ theme, variant }) =>
      Mixins.ClickBehavior(theme.button[variant], {
        hover: 0.1,
        active: 0.15,
      })}
    ${Mixins.Responsive(['font-size', '0.9em', { sm: '0.7em' }])}
    border-radius: 10px;
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bodyFontColor};
    color: ${({ theme }) => theme.bodyFontColor};
    min-width: 125px;
    padding: 1em;
  `;
}

export namespace CuratePromptStyle {
  export const Menu = styled.menu<{ visible: boolean }>`
    ${({ visible }) => Mixins.Visible(visible)}
    background-color: ${({ theme }) => theme.headerBackgroundColor};
    border-radius: 2px 10px 10px;
    box-shadow: 0 0 2px 1px ${({ theme }) => theme.bodyFontColor};
    font-family: ${FONTS.BODY};
    list-style-type: none;
    margin: 0;
    overflow: hidden;
    padding: 0;
    position: fixed;
    transition: opacity 0.3s;
  `;

  export const MenuItem = styled.li`
    ${({ theme }) => Mixins.ClickBehavior(theme.headerBackgroundColor)};
    ${Mixins.Responsive(['font-size', '1.1em', { sm: '1em' }])}
    cursor: pointer;
    padding: 1em 1.2em;
    transition: all 0.3s;
  `;
}
