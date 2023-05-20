import styled from 'styled-components';

namespace ErrorStyle {
  export const Container = styled.div`
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    padding: 1em;
  `;

  export const Main = styled.main`
    display: block;
    max-width: 500px;
  `;

  export const Text = styled.p`
    font-size: 1.3em;
    line-height: 1.6;
    text-align: center;
  `;

  export const Links = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;

    a {
      font-size: 1.1em;
    }
  `;
}

export default ErrorStyle;
