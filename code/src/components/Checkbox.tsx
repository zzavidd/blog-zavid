import React from 'react';

import CPX from 'styles/Components/Components.styles';
import { THEME } from 'styles/Variables.styles';

const stroke = THEME.dark.Color.Button.Cancel;

export default function Checkbox({ checked = false, ...props }: CheckboxProps) {
  return (
    <CPX.Checkbox checked={checked} className={props.className}>
      <input {...props} type={'checkbox'} hidden={true} />
      <svg
        xmlns={'http://www.w3.org/2000/svg'}
        viewBox={'0 0 32 32'}
        width={25}
        height={25}>
        <rect
          x={2}
          y={5}
          width={25}
          height={25}
          rx={5}
          ry={5}
          fill={'transparent'}
          stroke={stroke}
          strokeWidth={3}
        />
        <polyline
          points={'9,18 12.5,23 25,4'}
          fill={'transparent'}
          stroke={stroke}
          strokeWidth={5}
          strokeLinejoin={'round'}
          strokeLinecap={'round'}
        />
      </svg>
      <span>{props.label}</span>
    </CPX.Checkbox>
  );
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
