import styled, { css } from 'styled-components';

import { FONTS } from 'constants/styling';

namespace WL {
  export const Container = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
  `;

  export const Tray = styled.aside<{ open: boolean }>`
    border-right: 1px solid #fff;
    display: flex;
    flex: 1 0 ${({ open }) => (open ? '500px' : 0)};
    flex-direction: column;
    overflow: hidden;
    transition: all 0.3s ease;

    ${(props) =>
      props.open
        ? css`
            height: 100%;
            opacity: 1;
            width: 100%;
          `
        : css`
            height: 0;
            opacity: 0;
            width: 0;
          `};
  `;

  export const Form = styled.form`
    flex: 1 1 auto;
    height: 100%;
    overflow-y: auto;
    padding: 1em;
  `;

  export const FormFooter = styled.footer`
    flex: 1 1 auto;
  `;

  export const Main = styled.main`
    flex: 1 1 auto;
    overflow: hidden;
    width: 100%;
  `;

  export const Grid = styled.div`
    display: flex;
    flex-wrap: wrap;
    grid-gap: 1em;
    overflow-y: auto;
    padding: 1em;
    width: 100%;
  `;

  export const Cell = styled.div`
    background-color: rgba(61, 61, 93, 0.8);
    border-radius: 15px;
    flex: 1 1 25%;
    padding: 1em;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.03);
    }
  `;

  export const ItemName = styled.h3`
    font-family: ${FONTS.TITLE};
  `;

  export const Price = styled.p`
    font-weight: bold;
  `;

  export const Image = styled.img`
    border-radius: 10px;
    max-height: 175px;
    max-width: 175px;
    width: 100%;
  `;
}

export default WL;
