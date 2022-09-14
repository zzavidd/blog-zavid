import styled from 'styled-components';

namespace CPX {
  export const Button = styled.button.attrs({ type: 'button' })`
    border: 1px solid #fff;
    font-family: 'Mulish', sans-serif;
    transition-duration: 0.3s;
    user-select: none;
    outline: none;
  `;

  export const Clickable = styled.button.attrs({ type: 'button' })`
    background: none;
    border-style: none;
    outline: none;
  `;

  export const FormButton = styled(Button)`
    border-radius: 15px;
    color: #fff;
    min-width: 125px;
    padding: 1em;
  `;

  export const Hyperlink = styled.a.attrs({
    target: '_blank',
    rel: 'noopener noreferrer',
  })`
    text-decoration: none;
  `;

  export const SubmitButton = styled(FormButton)`
    background-color: #391144;
  `;
  export const CancelButton = styled(FormButton)`
    background-color: #8e74ab;
  `;
}

export default CPX;
