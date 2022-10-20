import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type {
  DefaultTheme,
  FlattenInterpolation,
  ThemeProps,
} from 'styled-components';
import styled, { createGlobalStyle, css } from 'styled-components';

import { FONTS } from 'stylesv2/Variables.styles';

namespace FORM {
  const DefaultStyle: FlattenInterpolation<ThemeProps<DefaultTheme>> = css`
    background: none;
    border: none;
    color: ${({ theme }) => theme.bodyFontColor};
    font-family: ${FONTS.BODY};
    font-size: 1.1em;
    outline: none;
    padding: 0.3em;
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
    border-bottom: 1px solid ${({ theme }) => theme.bodyFontColor};
    padding: 0.5em;
  `;

  export namespace Date {
    export const Container = styled.div`
      align-items: center;
      border-bottom: 1px solid ${({ theme }) => theme.bodyFontColor};
      display: flex;
      padding-block: 0.5em;
    `;

    export const LeadingIcon = styled(FontAwesomeIcon)`
      margin-right: 0.5em;
    `;

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

      .react-dateinput {
        ${DefaultStyle}
      }
    `;
  }

  export namespace Input {
    export const Container = styled.div`
      align-items: center;
      border-bottom: 1px solid ${({ theme }) => theme.bodyFontColor};
      display: flex;
      padding-block: 0.5em;
    `;

    export const Standard = styled.input`
      ${DefaultStyle}
      ${({ disabled }) =>
        disabled &&
        css`
          color: #808080;
        `}
    `;

    export const Paragraph = styled.textarea`
      ${DefaultStyle}
      border-bottom: 1px solid ${({ theme }) => theme.bodyFontColor};
      min-height: 50px;
      padding: 0.8em;
    `;
  }
}

export default FORM;
