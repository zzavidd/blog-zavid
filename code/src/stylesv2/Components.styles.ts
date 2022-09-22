import styled from 'styled-components';

namespace CPX {
  export const Button = styled.button.attrs({ type: 'button' })`
    border-style: none;
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
  `;

  export const Hyperlink = styled.a.attrs({
    target: '_blank',
    rel: 'noopener noreferrer',
  })`
    text-decoration: none;
  `;
}

export default CPX;
