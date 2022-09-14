import styled, { css } from 'styled-components';

import { BREAKPOINTS } from './Variables.styles';

namespace WL {
  export const Container = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
  `;

  export const Tray = styled.aside<{ open: boolean }>`
    border-right: 1px solid #fff;
    display: grid;
    grid-template-rows: 1fr auto;
    max-height: 80vh;
    max-width: 450px;
    overflow: auto;
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

  export const Form = styled.form`
    height: 100%;
    overflow: auto;
  `;

  export const FormFooter = styled.footer``;

  export const Main = styled.main`
    overflow-y: auto;
    width: 100%;
  `;

  export const Grid = styled.div`
    display: flex;
    flex-wrap: wrap;
    grid-gap: 1em;
    overflow: auto;
    padding: 1em;
    width: 100%;

    /* @media (max-width: ${BREAKPOINTS.LARGE}) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: ${BREAKPOINTS.MEDIUM}) {
      grid-template-columns: repeat(2, 1fr);
    } */
  `;

  export const Cell = styled.div`
    background-color: rgba(0, 0, 108, 0.8);
    border-radius: 15px;
    flex: 1 1 25%;
    padding: 1em;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.03);
    }
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
