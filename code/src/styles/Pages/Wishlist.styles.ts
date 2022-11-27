import { darken, transparentize } from 'polished';
import styled, { css, keyframes } from 'styled-components';

import type { WishlistItemPriority } from 'classes/wishlist/WishlistDAO';
import Checkbox from 'components/Checkbox';
import Input from 'components/Input';
import CPX from 'styles/Components/Components.styles';
import Mixins from 'styles/Mixins.styles';
import { BREAKPOINTS, COLOR, FONTS as FONT } from 'styles/Variables.styles';

const fadeIn = keyframes`
  0% {opacity: 0;}
  100% {opacity: 1;}
`;

namespace WishlistStyle {
  export const Container = styled.div`
    display: flex;
    font-family: ${FONT.BODY};
    height: 100%;
    width: 100%;
  `;

  export namespace Main {
    export const Container = styled.main`
      ${Mixins.Responsive(
        ['height', '100vh', { sm: 'initial' }],
        ['overflow-y', 'auto', { sm: 'visible' }],
      )}
      flex: 1 1 auto;
      position: relative;
      width: 100%;
    `;

    export const PageDetails = styled.div`
      align-items: center;
      display: flex;
      flex-direction: column;
      margin-inline: 1em;
      padding-block: 2em 1em;
    `;

    export const Title = styled.h1`
      margin: 0;
      text-align: center;
      text-transform: uppercase;
    `;

    export const Summary = styled.p`
      ${Mixins.Responsive(['font-size', '1.2em', { sm: '0.85em' }])}
      line-height: 160%;
      max-width: 800px;
      text-align: center;
    `;

    export const SummarySuffix = styled.p`
      ${Mixins.Responsive(['font-size', '0.9em', { sm: '0.7em' }])}
      max-width: 800px;
      text-align: center;
    `;

    export const Grid = styled.div`
      ${Mixins.Responsive(
        ['grid-gap', '1em', { sm: '0.5em' }],
        ['padding', '1em', { sm: '0.5em' }],
      )}
      align-items: flex-start;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, auto));
      justify-content: center;
      overflow-y: auto;
      width: 100%;

      @media (max-width: ${BREAKPOINTS.sm}) {
        grid-template-columns: repeat(auto-fill, minmax(150px, auto));
      }
    `;

    export const Item = styled.div<{ image: string }>`
      align-items: flex-end;
      animation: ${fadeIn} 0.5s ease;
      border: 2px solid ${({ theme }) => theme.bodyFontColor};
      border-radius: 15px;
      display: flex;
      flex: 1 1;
      flex-direction: column;
      height: 100%;
      max-width: 300px;
      overflow: hidden;
      position: relative;
      transition: all 0.3s ease;
    `;

    export const CrudControlBox = styled.div`
      ${Mixins.Responsive(['display', 'flex', { sm: 'none' }])}
      background-color: #212121ae;
      border-radius: 10px;
      gap: 0.2em;
      padding: 0.2em;
      position: absolute;
      right: 3%;
      top: 2%;
      z-index: 1;

      svg {
        color: ${COLOR.WHITE};
        transition: all 0.3s;

        &:hover {
          transform: scale(0.9);
        }
      }
    `;

    export const ItemImageBox = styled(CPX.Clickable)`
      ${Mixins.Responsive(['height', '200px', { sm: '150px' }])}
      background-color: ${COLOR.WHITE};
      flex: 0 0 auto;
      height: 200px;
      overflow: hidden;
      padding: 0;
      width: 100%;
    `;

    export const ItemImage = styled.img`
      height: 100%;
      object-fit: cover;
      transition: transform 0.8s;
      width: 100%;

      &:hover {
        transform: scale(1.06);
      }
    `;

    export const ItemDetails = styled.div<ItemDetailsProps>`
      background-color: ${({ claimed, purchased, theme }) =>
        transparentize(
          0.2,
          purchased
            ? theme.wishlistItem.purchased
            : claimed
            ? theme.wishlistItem.claimed
            : theme.wishlistItem.cell,
        )};
      border-top: 1px solid ${({ theme }) => theme.bodyFontColor};
      display: flex;
      flex: 1 0 auto;
      flex-direction: column;
      padding: 1em;
      width: 100%;
    `;

    export const ItemName = styled.h3`
      ${Mixins.Responsive(['font-size', '1.3em', { sm: '0.95em' }])}
      color: ${({ theme }) => theme.bodyFontColor};
      font-family: ${FONT.TITLE};
      margin: 0;
    `;

    export const ItemSubBox = styled.div`
      position: relative;
    `;

    export const ItemPriority = styled.small<ItemPriorityProps>`
      ${Mixins.Responsive(
        ['font-size', '0.65em', { sm: '8px' }],
        ['min-width', '50px', { sm: '35px' }],
      )}
      background-color: ${({ priority }) => COLOR.WISHLIST_PRIORITY[priority]};
      border: 1px solid
        ${({ priority }) => darken(0.5, COLOR.WISHLIST_PRIORITY[priority])};
      border-radius: 5px;
      color: ${({ priority }) =>
        darken(0.5, COLOR.WISHLIST_PRIORITY[priority])};
      float: right;
      font-weight: bold;
      margin-left: 0.5em;
      padding: 0.3em 0.5em;
      text-align: center;
      top: 1em;
      width: fit-content;
    `;

    export const ItemPrice = styled.p`
      ${Mixins.Responsive(['font-size', '1em', { sm: '0.8em' }])}
      font-weight: bold;
      margin: 0.5em 0;
    `;

    export const ItemCategory = styled.span`
      ${Mixins.Responsive(['font-size', '0.7em', { sm: '0.55em' }])}
    `;

    export const ItemQuantity = styled.span`
      ${Mixins.Responsive(['font-size', '0.8em', { sm: '0.6em' }])}
    `;

    export const ItemComments = styled.div`
      ${Mixins.Responsive(['font-size', '0.7em', { sm: '0.5em' }])}
      background-color: #883e69;
      border-radius: 1em;
      color: ${COLOR.WHITE};
      margin-top: 1em;
      padding: 0.5em 1em;
      width: fit-content;

      svg {
        margin: 0;
        margin-right: 0.4em;
      }

      span {
        white-space: pre-line;
      }
    `;

    export const ItemReservees = styled.p<{ complete: boolean }>`
      ${Mixins.Responsive(['font-size', '0.8em', { sm: '0.6em' }])}
      color: ${({ complete, theme }) =>
        complete
          ? theme.wishlistItem.claimCountComplete
          : theme.wishlistItem.claimCount};
      font-weight: ${({ theme }) => theme.wishlistItem.claimCountFontWeight};
      margin-block: 0.4em;
      transition: all 0.3s;
    `;

    export const ItemPurchasedText = styled.p`
      ${Mixins.Responsive(['font-size', '1em', { sm: '0.75em' }])}
    `;

    export const ItemCellFooter = styled.footer`
      align-items: flex-end;
      border-radius: 10px;
      display: flex;
      flex: 0 0 auto;
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

  export const Tray = styled.aside<{ open: boolean }>`
    background-color: rgba(26, 23, 41, 0.3);
    border-left: 1px solid ${({ theme }) => theme.bodyFontColor};
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

  export namespace Claim {
    export const Container = styled.div`
      ${Mixins.Responsive(['font-size', '100%', { sm: '75%' }])}
      column-gap: 2em;
      display: grid;
      grid-template-columns: 0.5fr 0.5fr;
      padding: 0.5em;
    `;

    export const Partition = styled.section`
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      font-size: 90%;
      gap: 2em;
      justify-content: flex-start;
    `;

    export const Text = styled.p`
      font-size: 1.2em;
      margin: 0;
    `;

    export const DetailsBox = styled.div`
      font-size: 0.9em;
      margin-top: 1em;
    `;

    export const ImageBox = styled.div`
      background-color: ${COLOR.WHITE};
      border-radius: 15px;
      flex: 1 1;
      justify-self: flex-end;
      max-height: 200px;
      overflow: hidden;
      width: 100%;
    `;

    export const Image = styled.img`
      height: 100%;
      object-fit: contain;
      width: 100%;
    `;

    export const PriceBox = styled.div`
      flex: 0 0;
      text-align: right;

      h3 {
        margin: 0;
      }

      p {
        font-size: 1.3em;
        margin-block: 0.5em;
      }
    `;
  }

  export namespace Toolbar {
    export const Container = styled.div`
      ${Mixins.Responsive(['padding', '0.6em 1em', { sm: '0.3em 0.5em' }])}
      align-items: center;
      background-color: ${({ theme }) => theme.headerBackgroundColor};
      border-bottom: 1px solid ${({ theme }) => theme.fadedFontColor};
      border-top: 1px solid ${({ theme }) => theme.fadedFontColor};
      display: flex;
      justify-content: space-between;
      padding: 0.6em 1em;
      position: sticky;
      top: 0;
      z-index: 2;
    `;

    export const SortBox = styled.div`
      display: flex;
      gap: 0.5em;
    `;

    export const Dropdown = styled(Input.Select)`
      ${Mixins.Responsive(['font-size', '0.85em', { sm: '0.55em' }])}
      appearance: none;
      border: none;
      padding: 0.5em;
      width: max-content;
    `;

    export const HidePurchasedCheckbox = styled(Checkbox)`
      ${Mixins.Responsive(['font-size', '1em', { sm: '0.65em' }])}
    `;

    export const AddButton = styled(CPX.Button)<{ visible: boolean }>`
      ${Mixins.Responsive(['display', 'block', { sm: 'none' }])}
      ${({ visible }) => Mixins.Visible(visible)}
      background: none;
      color: ${({ theme }) => theme.bodyFontColor};
      font-size: 0.9em;
      height: fit-content;
      text-decoration: none;

      svg {
        color: ${({ theme }) => theme.bodyFontColor};
        margin-right: 0.4em;
      }

      &:hover {
        border-bottom: 1px solid ${({ theme }) => theme.bodyFontColor};
      }
    `;
  }
}

export default WishlistStyle;

interface ItemPriorityProps {
  priority: WishlistItemPriority;
}

interface ItemDetailsProps {
  claimed: boolean;
  purchased: boolean;
}
