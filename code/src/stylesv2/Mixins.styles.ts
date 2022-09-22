import { darken } from 'polished';
import { css } from 'styled-components';
import type { FlattenSimpleInterpolation } from 'styled-components';

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
