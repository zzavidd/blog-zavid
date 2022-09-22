import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import React, { useMemo } from 'react';

import FORM from 'stylesv2/Form.styles';

import Clickable from './Clickable';

namespace Input {
  export function Text(props: IInputProps) {
    return <IInput {...props} type={'text'} />;
  }

  export function Number(props: IInputProps) {
    const value = useMemo(() => {
      return parseFloat((props.value as string) || '0').toString();
    }, [props.value]);
    return (
      <IInput {...props} type={'number'} value={value} min={props.min ?? 0} />
    );
  }

  export function Url(props: IInputProps) {
    return (
      <IInput
        {...props}
        type={'url'}
        pattern={'https://.*'}
        placeholder={'https://www.example.com'}
      />
    );
  }
}

function IInput(props: IInputProps) {
  return (
    <FORM.Input.Container>
      {props.leadingIcon && (
        <Clickable.Icon
          icon={props.leadingIcon}
          onClick={props.leadingIconAction}
        />
      )}
      <FORM.Input.Standard
        {...props}
        autoCapitalize={'off'}
        autoComplete={'off'}
      />
      {props.trailingIcon && (
        <Clickable.Icon
          icon={props.trailingIcon}
          onClick={props.trailingIconAction}
        />
      )}
    </FORM.Input.Container>
  );
}

export default Input;

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: IconDefinition;
  leadingIconAction?: () => void;
  trailingIcon?: IconDefinition;
  trailingIconAction?: () => void;
}
