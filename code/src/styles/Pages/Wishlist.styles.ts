import styled, { css } from 'styled-components';

import Input from 'componentsv2/Input';
import CPX from 'styles/Components/Components.styles';
import Mixins from 'styles/Mixins.styles';
import { BREAKPOINTS, COLOR, FONTS as FONT } from 'styles/Variables.styles';

namespace WishlistStyle {
  export const Container = styled.div`
    display: flex;
    font-family: ${FONT.BODY};
    height: 100%;
    width: 100%;
  `;

  export namespace Main {
    export const Container = styled.main`
      flex: 1 1 auto;
      height: 100vh;
      overflow-y: auto;
      position: relative;
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

      @media (max-width: ${BREAKPOINTS.sm}) {
        grid-template-columns: repeat(auto-fill, minmax(150px, auto));
      }
    `;

    export const Cell = styled.div<{ image: string }>`
      align-items: flex-end;
      border-radius: 15px;
      box-shadow: 0 0 10px 1px #323232;
      display: flex;
      flex: 1 1;
      flex-direction: column;
      height: 100%;
      max-width: 300px;
      overflow: hidden;
      position: relative;
      transition: all 0.3s ease;
    `;

    export const CellImageContainer = styled(CPX.Clickable)`
      ${Mixins.Responsive(['height', '200px', { sm: '150px' }])}
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
      ${Mixins.Responsive(['font-size', '1.3em', { sm: '1em' }])}
      color: ${COLOR.WHITE};
      font-family: ${FONT.TITLE};
      letter-spacing: -1px;
      margin: 0;
    `;

    export const ItemPrice = styled.p`
      ${Mixins.Responsive(['font-size', '1em', { sm: '0.8em' }])}
      font-weight: bold;
      margin-bottom: 0.5em;
    `;

    export const ItemQuantity = styled.span`
      ${Mixins.Responsive(['font-size', '0.8em', { sm: '0.6em' }])}
    `;

    export const ItemReservees = styled.p<{ complete: boolean }>`
      ${Mixins.Responsive(['font-size', '0.8em', { sm: '0.6em' }])}
      color: ${({ complete }) => (complete ? '#00ff00' : '#ffff8d')};
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
      ${Mixins.Responsive(
        ['font-size', '0.8em', { sm: '0.6em' }],
        ['padding', '0.75em', { sm: '0.9em 0.75em' }],
      )}
      color: ${COLOR.WHITE};
      flex: 1;
      outline: 1px solid #3d3d3d;
    `;
  }

  export namespace Tray {
    export const Container = styled.aside<{ open: boolean }>`
      background-color: rgba(26, 23, 41, 0.3);
      border-left: 1px solid #fff;
      display: flex;
      flex: 1 0 ${({ open }) => (open ? '500px' : 0)};
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
      transition: all 0.1s linear;

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

  export namespace Toolbar {
    export const Container = styled.div`
      background-color: ${({ theme }) => theme.headerBackgroundColor};
      bottom: 0;
      display: flex;
      justify-content: space-between;
      padding: 0.6em 1em;
      position: sticky;
      z-index: 2;
    `;

    export const Dropdown = styled(Input.Select)`
      appearance: none;
      border: 1px solid ${({ theme }) => theme.bodyFontColor};
      border-radius: 15px;
      padding: 0.5em;
      width: max-content;
    `;

    export const AddButton = styled(CPX.Button)<{ visible: boolean }>`
      ${({ visible }) => Mixins.Visible(visible)}
      background: none;
      color: ${({ theme }) => theme.bodyFontColor};
      text-decoration: none;

      svg {
        color: ${({ theme }) => theme.bodyFontColor};
        margin-right: 0.4em;
      }

      &:hover {
        text-decoration: underline;
      }
    `;
  }
}

export default WishlistStyle;
