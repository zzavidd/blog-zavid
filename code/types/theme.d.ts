import { CustomTheme } from '@ziventi/wishlist/types';
import 'styled-components';
import type { ButtonVariant } from 'styles/Variables.styles';

declare module 'styled-components' {
  interface DefaultTheme extends CustomTheme {
    Image: {
      Background: string;
    };
  }
}
