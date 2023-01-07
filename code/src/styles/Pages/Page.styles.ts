import styled from 'styled-components';

import { Paragraph } from 'components/Text';
import Mixins from 'styles/Mixins.styles';

namespace PageStyle {
  export const Container = styled.main`
    display: flex;
    justify-content: center;
    padding: 2em;
  `;

  export const Main = styled.main`
    display: flex;
    flex-direction: column;
    max-width: 650px;
  `;

  export const Title = styled.h2`
    font-family: ${({ theme }) => theme.Font.Title};
    font-size: 2.4em;
    margin: 0;
  `;

  export const Content = styled(Paragraph)`
    ${Mixins.Responsive(['font-size', '1.25em', { sm: '1em' }])}

    p {
      line-height: 1.8;
    }
  `;
}

export default PageStyle;
