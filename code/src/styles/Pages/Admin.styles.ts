import styled from 'styled-components';

import CPX from 'styles/Components/Components.styles';
import Mixins from 'styles/Mixins.styles';

namespace AdminStyle {
  export const Container = styled.div`
    height: 100%;
    padding: 2em;
  `;

  export const Main = styled.main`
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
  `;

  export const NavButton = styled(CPX.Button)`
    ${({ theme }) => Mixins.ClickBehavior(theme.headerBackgroundColor)}
    background-color: ${({ theme }) => theme.headerBackgroundColor};
    border: 2px solid ${({ theme }) => theme.bodyFontColor};
    border-radius: 20px;
    color: ${({ theme }) => theme.bodyFontColor};
    font-size: 1.5em;
    padding: 1em 2em;
  `;
}

export default AdminStyle;
