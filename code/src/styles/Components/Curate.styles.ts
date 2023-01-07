import styled from 'styled-components';

import Mixins from 'styles/Mixins.styles';
import type { ButtonVariant } from 'styles/Variables.styles';

import CPX from './Components.styles';

export namespace CuratorStyle {
  export const CanvasBox = styled.div`
    display: flex;
    justify-content: center;
  `;

  export const Canvas = styled.canvas`
    display: none;
  `;

  export const PreviewImage = styled.img`
    max-height: 60vh;
    max-width: 100%;
  `;

  export const SettingsBox = styled.section`
    ${Mixins.Responsive(['font-size', '1em', { sm: '0.7em' }])}
    display: flex;
    flex-direction: column;
    font-family: ${({ theme }) => theme.Font.Body};
    gap: 1em;
    padding-block: 1em;
  `;

  export const Tip = styled.p`
    ${Mixins.Responsive(['display', 'none', { sm: 'block' }])}
    font-size: 0.8em;
    margin: 0;
  `;

  export const FooterButton = styled(CPX.Button)<{ variant: ButtonVariant }>`
    ${({ theme, variant }) =>
      Mixins.ClickBehavior(theme.Color.Button[variant], {
        hover: 0.1,
        active: 0.15,
      })}
    ${Mixins.Responsive(['font-size', '0.9em', { sm: '0.7em' }])}
    border-radius: 10px;
    box-shadow: 0 0 0 1px ${({ theme }) => theme.Color.Font.Body};
    color: ${({ theme }) => theme.Color.Font.Body};
    min-width: 125px;
    padding: 1em;
  `;
}

export namespace CuratePromptStyle {
  export const Menu = styled.menu<{ visible: boolean }>`
    ${({ visible }) => Mixins.Visible(visible)}
    background-color: ${({ theme }) => theme.Color.Background.Header};
    border-radius: 2px 10px 10px;
    box-shadow: 0 0 2px 1px ${({ theme }) => theme.Color.Font.Body};
    font-family: ${({ theme }) => theme.Font.Body};
    list-style-type: none;
    margin: 0;
    overflow: hidden;
    padding: 0;
    position: fixed;
    transition: opacity 0.3s;
  `;

  export const MenuItem = styled.li`
    ${({ theme }) => Mixins.ClickBehavior(theme.Color.Background.Header)};
    ${Mixins.Responsive(['font-size', '1.1em', { sm: '1em' }])}
    cursor: pointer;
    padding: 1em 1.2em;
    transition: all 0.3s;
  `;
}
