import type * as CSS from 'csstype';
import { darken } from 'polished';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';

import type { Breakpoint } from 'stylesv2/Variables.styles';
import { BREAKPOINTS } from 'stylesv2/Variables.styles';

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
      return css`
        ${attribute}: ${fallback};
        ${breakpoints &&
        Object.entries(breakpoints).map(([breakpoint, value]) => {
          return css`
            @media (max-width: ${BREAKPOINTS[breakpoint as Breakpoint]}) {
              ${attribute}: ${value};
            }
          `;
        })}
      `;
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
