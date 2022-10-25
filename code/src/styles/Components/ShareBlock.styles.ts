import styled from 'styled-components';

import { COLOR } from 'styles/Variables.styles';

import CPX from './Components.styles';

namespace ShareBlockStyle {
  export const Container = styled.section`
    display: flex;
    flex-direction: column;
    gap: 0.8em;
  `;

  export const ButtonGroup = styled.div`
    display: flex;
    gap: 0.2em;
  `;

  export const ShareLinkButton = styled(CPX.Button)`
    background-color: #926aa1;
    border-radius: 50%;
    height: 50px;
    margin: 0;
    width: 50px;

    svg {
      color: ${COLOR.WHITE};
      font-size: 2em;
    }
  `;
}

export default ShareBlockStyle;
