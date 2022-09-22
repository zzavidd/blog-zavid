import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css } from 'styled-components';

import { COLOR, FONTS } from 'constants/styling';

namespace FORM {
  export const Container = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2em;
    height: 100%;
    overflow-y: auto;
    padding: 2em;
  `;

  export const FieldRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1.5em;
    width: 100%;
  `;

  export const Field = styled.div`
    flex: 1 1;
    width: 100%;
  `;

  export const Label = styled.label`
    font-family: ${FONTS.TITLE};
    font-size: 1.1em;
  `;

  export namespace Input {
    const DefaultStyle: FlattenSimpleInterpolation = css`
      background: none;
      border: none;
      color: ${COLOR.WHITE};
      font-size: 1.2em;
      outline: none;
      width: 100%;
    `;

    export const Container = styled.div`
      align-items: center;
      border-bottom: 1px solid ${COLOR.WHITE};
      display: flex;
      height: 100;
      padding: 0.5em;
    `;

    export const Standard = styled.input`
      ${DefaultStyle}
    `;

    export const Paragraph = styled.textarea`
      ${DefaultStyle}
      border-bottom: 1px solid ${COLOR.WHITE};
      min-height: 50px;
    `;
  }
}

export default FORM;
