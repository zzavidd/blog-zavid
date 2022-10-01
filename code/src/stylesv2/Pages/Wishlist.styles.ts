import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, { css } from 'styled-components';

import CPX from 'stylesv2/Components/Components.styles';
import Mixins from 'stylesv2/Mixins.styles';
import { BREAKPOINTS, COLOR, FONTS as FONT } from 'stylesv2/Variables.styles';

namespace WL {
  export const Container = styled.div`
    display: flex;
    font-family: ${FONT.BODY};
    height: 100%;
    width: 100%;
  `;

  export namespace Tray {
    export const Container = styled.aside<{ open: boolean }>`
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

    const FormButton = styled(CPX.Button)`
      color: ${COLOR.WHITE};
      flex: 1 1 auto;
      font-size: 1em;
      font-weight: bold;
      padding: 1.3em;
    `;

    export const FormSubmitButton = styled(FormButton)`
      ${Mixins.ClickBehavior('#2f223d', {
        hover: 0.05,
        active: 0.07,
      })}
    `;

    export const FormCancelButton = styled(FormButton)`
      ${Mixins.ClickBehavior('#533c6c', {
        hover: -0.05,
        active: 0.02,
      })}
    `;
  }

  export namespace Main {
    export const Container = styled.main`
      flex: 1 1 auto;
      height: 100vh;
      overflow-y: auto;
      width: 100%;
    `;

    export const Grid = styled.div`
      align-items: flex-start;
      display: grid;
      grid-gap: 1em;
      grid-template-columns: repeat(auto-fill, minmax(250px, auto));
      justify-content: center;
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: 1em;
      width: 100%;
    `;

    export const Cell = styled.div<{ image: string }>`
      align-items: flex-end;
      border-radius: 15px;
      box-shadow: 0 0 10px 1px #323232;
      display: flex;
      flex: 1 1 250px;
      flex-direction: column;
      height: 100%;
      max-width: 300px;
      overflow: hidden;
      position: relative;
      transition: all 0.3s ease;

      @media (max-width: ${BREAKPOINTS.sm}) {
        flex: 1 1 150px;
      }
    `;

    export const CellImageContainer = styled(CPX.Clickable)`
      background-color: ${COLOR.WHITE};
      flex: 0 0 auto;
      height: 200px;
      overflow: hidden;
      padding: 0;
      width: 100%;
    `;

    export const ItemCellImage = styled.img`
      height: 100%;
      object-fit: cover;
      transition: all 0.8s;
      width: 100%;

      &:hover {
        transform: scale(1.06);
      }
    `;

    export const CellContent = styled.div`
      background-color: rgba(52, 43, 59, 0.8);
      display: flex;
      flex: 1 0 auto;
      flex-direction: column;
      padding: 1em;
      width: 100%;
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
      z-index: 2;

      svg {
        color: ${COLOR.WHITE};
        transition: all 0.3s;

        &:hover {
          transform: scale(0.9);
        }
      }
    `;

    export const ItemName = styled.h3`
      color: ${COLOR.WHITE};
      font-family: ${FONT.TITLE};
      font-size: 1.3em;
      margin: 0;
    `;

    export const ItemPrice = styled.p`
      font-weight: bold;
      margin-bottom: 0.5em;
    `;

    export const ItemQuantity = styled.span`
      font-size: 0.8em;
    `;

    export const ItemReservees = styled.p<{ complete: boolean }>`
      color: ${({ complete }) => (complete ? '#00ff00' : '#ffff8d')};
      font-size: 0.8em;
      margin-block: 0.4em;
      transition: all 0.3s;
    `;

    export const ItemCellFooter = styled.footer`
      align-items: flex-end;
      border-radius: 10px;
      display: flex;
      flex: 1;
      justify-self: flex-end;
      margin-top: 1em;
      overflow: hidden;
    `;

    export const ItemCellFooterButton = styled(CPX.Button)<{
      color: string;
    }>`
      ${({ color }) =>
        Mixins.ClickBehavior(color, {
          hover: 0.1,
          active: 0.15,
        })}
      color: ${COLOR.WHITE};
      flex: 1;
      font-size: 0.8em;
      outline: 1px solid #3d3d3d;
      padding: 0.75em;
    `;
  }

  export namespace Claim {
    export const Container = styled.div`
      column-gap: 2em;
      display: grid;
      grid-template-columns: 0.5fr 0.5fr;
      padding: 0.5em;
    `;

    export const Partition = styled.section`
      display: flex;
      flex: 1 1;
      flex-direction: column;
      font-size: 90%;
      gap: 2em;
      justify-content: center;
    `;

    export const ImageContainer = styled.div`
      border-radius: 15px;
      justify-self: flex-end;
      max-height: 300px;
      overflow: hidden;
      width: 100%;
    `;

    export const Image = styled.img`
      height: 100%;
      object-fit: contain;
      width: 100%;
    `;

    export const Text = styled.p`
      font-size: 1.2em;
      margin: 0;
    `;
  }

  export const FloatingActionButton = styled.button.attrs({ type: 'button' })<{
    visible: boolean;
  }>`
    ${Mixins.ClickBehavior('rgba(67, 37, 66, 0.95)')};
    ${({ visible }) => Mixins.Visible(visible)};
    border-style: none;
    color: ${COLOR.WHITE};
    border-radius: 50%;
    box-shadow: 0 0 5px 3px #7c687b;
    position: fixed;
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
