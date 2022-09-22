import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { darken, lighten } from 'polished';
import styled, { css } from 'styled-components';

import { COLOR, FONTS as FONT } from 'constants/styling';

import CPX from './Components.styles';
import Mixins from './Mixins.styles';

namespace WL {
  export const Container = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
  `;

  export const Tray = styled.aside<{ open: boolean }>`
    background-color: rgba(26, 23, 41, 0.3);
    border-right: 1px solid #fff;
    display: flex;
    flex: 1 0 ${({ open }) => (open ? '500px' : 0)};
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    transition: all 0.3s ease;

    ${(props) =>
      props.open
        ? css`
            opacity: 1;
            width: 100%;
          `
        : css`
            opacity: 0;
            width: 0;
          `};
  `;

  export const FormFooter = styled.footer`
    display: flex;
    flex: 0 1 auto;
  `;

  export const FormSubmitButton = styled(CPX.Button)`
    ${Mixins.ClickBehavior('#2f223d', {
      hover: 0.05,
      active: 0.07,
    })}
    flex: 1 1 auto;
    padding: 1.3em;
  `;

  export const FormCancelButton = styled(CPX.Button)`
    ${Mixins.ClickBehavior('#533c6c', {
      hover: -0.05,
      active: 0.02,
    })}
    flex: 1 1 auto;
    padding: 1.3em;
  `;

  export const Main = styled.main`
    flex: 1 1 auto;
    overflow: hidden;
    width: 100%;
  `;

  export const ItemGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    grid-gap: 1em;
    height: 100vh;
    justify-content: center;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 1em;
    width: 100%;
  `;

  export const ItemCell = styled.div<{ image: string }>`
    background-image: ${({ image }) => css`url(${image})`};
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 15px;
    flex: 1 1 0;
    max-width: 300px;
    min-width: 250px;
    overflow: hidden;
    position: relative;
    transition: all 0.3s ease;
  `;

  export const ItemCellContent = styled.div`
    background-color: rgba(68, 68, 68, 0.6);
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1em;
  `;

  export const CrudControls = styled.div`
    background-color: #212121ae;
    border-radius: 10px;
    display: flex;
    gap: 0.2em;
    padding: 0.2em;
    position: absolute;
    right: 3%;
    top: 2%;

    svg {
      transition: all 0.3s;
      &:hover {
        transform: scale(0.9);
      }
    }
  `;

  export const ItemName = styled.h3`
    color: ${COLOR.WHITE};
    font-family: ${FONT.TITLE};
  `;

  export const ItemPrice = styled.p`
    font-weight: bold;
  `;

  export const ItemCellFooter = styled.footer`
    border-radius: 10px;
    display: flex;
    justify-self: flex-end;
    overflow: hidden;
  `;

  export const ItemCellFooterButton = styled(CPX.Button)`
    ${Mixins.ClickBehavior('#3d3743', {
      hover: 0.05,
      active: 0.07,
    })}
    flex: 1 1 0;
    outline: 1px solid #3d3d3d;
    padding: 0.75em;
  `;

  export const FloatingActionButton = styled.button.attrs({ type: 'button' })<{
    visible: boolean;
  }>`
    ${Mixins.ClickBehavior('rgba(67, 37, 66, 0.95)')}
    ${({ visible }) => Mixins.Visible(visible)}
    border-style: none;
    border-radius: 50%;
    box-shadow: 0 0 5px 3px #242024;
    position: absolute;
    padding: 0.85em;
    font-size: 2.5em;
    right: 3%;
    bottom: 5%;
    transition: all 0.3s;

    &:hover {
      transform: scale(1.1);
    }
  `;

  export const FabIcon = styled(FontAwesomeIcon)`
    display: block;
  `;
}

export default WL;
