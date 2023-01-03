import styled from 'styled-components';

import Mixins from 'styles/Mixins.styles';

namespace WishlistStyle {
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
  }
}

export default WishlistStyle;
