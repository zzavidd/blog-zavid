import type * as CSS from 'csstype';
import { darken } from 'polished';
import { css } from 'styled-components';
import type { FlattenSimpleInterpolation, CSSObject } from 'styled-components';

import type { Breakpoint } from 'styles/Variables.styles';
import { BREAKPOINTS } from 'styles/Variables.styles';

namespace Mixins {
  export function ClickBehavior(
    color: string,
    options?: ClickBehaviorOptions,
  ): FlattenSimpleInterpolation {
    return css`
      background-color: ${color};

      &:hover {
        background-color: ${darken(options?.hover || 0.05, color)};
      }

      &:active {
        background-color: ${darken(options?.active || 0.1, color)};
      }
    `;
  }

  export function Responsive(
    ...entries: ResponsiveEntry[]
  ): FlattenSimpleInterpolation {
    return entries.map(([attribute, fallback, breakpoints]) => {
      const styles: CSSObject = { [attribute]: fallback };
      Object.entries(breakpoints).forEach(([breakpoint, value]) => {
        styles[`@media (max-width: ${BREAKPOINTS[breakpoint as Breakpoint]}`] =
          {
            [attribute]: value,
          };
      });

      return styles;
    });
  }

  export function Visible(
    visible: boolean,
    additions?: ConditionalAdditions,
  ): FlattenSimpleInterpolation {
    return visible
      ? css`
          opacity: 1;
          pointer-events: auto;
          ${additions?.whenTrue}
        `
      : css`
          opacity: 0;
          pointer-events: none;
          ${additions?.whenFalse}
        `;
  }
}

export default Mixins;

interface ClickBehaviorOptions {
  hover: number;
  active: number;
}

interface ConditionalAdditions {
  whenTrue: FlattenSimpleInterpolation;
  whenFalse?: FlattenSimpleInterpolation;
}

type ResponsiveEntry = [
  keyof CSS.PropertiesHyphen,
  string | number,
  Partial<Record<Breakpoint, string | number>>,
];
