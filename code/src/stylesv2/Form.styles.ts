import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { createGlobalStyle, css } from 'styled-components';

import { COLOR, FONTS } from 'constants/styling';

namespace FORM {
  const DefaultStyle: FlattenSimpleInterpolation = css`
    background: none;
    border: none;
    color: ${COLOR.WHITE};
    font-size: 1.2em;
    outline: none;
    width: 100%;
  `;

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

  export const Field = styled.div<{ flex?: number }>`
    flex: ${({ flex = 1 }) => `${flex} ${flex}`};
    width: 100%;
  `;

  export const Label = styled.label`
    font-family: ${FONTS.TITLE};
    font-size: 1.1em;
  `;

  export const Select = styled.select`
    ${DefaultStyle}
    border-bottom: 1px solid ${COLOR.WHITE};
    padding: 0.5em;
  `;

  export namespace Date {
    export const ReactDatepickerGlobalStyle = createGlobalStyle`
      .react-datepicker,
      .react-datepicker__header,
      .react-datepicker__today-button {
        background-color: rgba(36, 36, 36, 0.8);
      }

      .react-datepicker-popper[data-placement^=top] {
        padding-bottom: 0;
      }

      .react-datepicker__day--disabled,
      .react-datepicker__day--outside-month {
        color: #808080;
      }
    `;
  }

  export namespace Input {
    export const Container = styled.div`
      align-items: center;
      border-bottom: 1px solid ${COLOR.WHITE};
      display: flex;
      padding-block: 0.5em;
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
