import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';

import {
  ConfirmButton,
  CancelButton,
  InvisibleButton
} from 'components/button';
import { Spacer, Toolbar } from 'components/layout';
import css from 'styles/components/Form.module.scss';

export { FileSelector } from './fileselector';

/**
 * A form component.
 * @param {object} props - The component props.
 * @param {string} [props.confirmButtonText] - The text displayed on the confirm button.
 * @param {Function} props.confirmFunction - The function called on clicking the confirm button.
 * @param {Function} props.cancelFunction - The function called on clicking the cancel button.
 * @param {boolean} props.isRequestPending - Indicates whether a request is currently pending.
 * @param {any} props.children - The component children.
 * @returns {React.Component} The component.
 */
export const Form = ({
  confirmButtonText = 'Submit',
  confirmFunction,
  cancelFunction,
  isRequestPending,
  children
}) => {
  return (
    <Spacer>
      <div className={css['form']}>{children}</div>
      <Toolbar>
        <div className={css['form-footer']}>
          <ConfirmButton
            onClick={confirmFunction}
            isRequestPending={isRequestPending}>
            {confirmButtonText}
          </ConfirmButton>
          <CancelButton onClick={cancelFunction}>Cancel</CancelButton>
        </div>
      </Toolbar>
    </Spacer>
  );
};

/**
 * A row of fields in the form.
 * @param {object} props - The component props.
 * @param {any} props.children - The component children.
 * @returns {React.Component} The component.
 */
export const FieldRow = ({ children }) => {
  return <Row>{children}</Row>;
};

/**
 * A form field component.
 * @param {object} props - The component props.
 * @returns {React.Component} The component.
 */
export const Field = (props) => {
  return (
    <Col {...props} className={css['form-field']}>
      {props.children}
    </Col>
  );
};

/**
 * A label component.
 * @param {object} props - The component props.
 * @param {string} props.children - The label text.
 * @returns {React.Component} The component.
 */
export const Label = ({ children }) => {
  return <label className={css['label']}>{children}</label>;
};

/**
 * A text input component.
 * @param {object} props - The component props.
 * @param {string} props.name - The object property this input represents.
 * @param {string} props.value - The current text in the input.
 * @param {Function} props.onClick - The function called on clicking on the input.
 * @param {Function} props.onChange - The function called on text change.
 * @param {string} props.placeholder - The placeholder text.
 * @param {React.Component} [props.leadingComponent] - A component placed before the input.
 * @param {React.Component} [props.trailingComponent] - A component placed after the input.
 * @returns {React.Component} The component.
 */
export const TextInput = (props) => {
  const theme = useSelector(({ theme }) => theme);
  const { onClick, leadingComponent = null, trailingComponent = null } = props;

  return (
    <div className={css[`text-input-field-${theme}`]}>
      {leadingComponent}
      {onClick ? (
        <InvisibleButton onClick={onClick} className={css['text-click-input']}>
          <Input {...props} />
        </InvisibleButton>
      ) : (
        <Input {...props} />
      )}
      {trailingComponent}
    </div>
  );
};

const Input = ({ name, value, onChange, placeholder, onClick }) => {
  if (value === null) value = '';
  return (
    <input
      name={name}
      type={'text'}
      value={value}
      onChange={onChange}
      className={css[`text-input`]}
      autoComplete={'off'}
      placeholder={placeholder}
      readOnly={!!onClick}
    />
  );
};

export const Select = (props) => {
  const { name, items, value = '', onChange, placeholder = '' } = props;

  const theme = useSelector(({ theme }) => theme);

  // Make widgets account for values of '00' (time)
  const selectedValue = value === 0 ? '00' : value;
  const color = !selectedValue && placeholder && '#8E8E8E';

  return (
    <select
      name={name}
      items={items}
      value={selectedValue}
      onChange={onChange}
      className={css[`select-${theme}`]}
      style={{ color }}>
      {placeholder ? (
        <option value={''} disabled>
          {placeholder}
        </option>
      ) : null}
      {items.map((item, key) => {
        const label = item.label || item;
        const value = item.value || item;
        return (
          <option key={key} value={value}>
            {label}
          </option>
        );
      })}
    </select>
  );
};

/**
 * A single-line {@link Textarea} component.
 * @param {object} props - The component props.
 * @returns {React.Component} The component.
 */
export const ShortTextArea = (props) => {
  return <Textarea {...props} minRows={1} />;
};

/**
 * A multi-line {@link Textarea} component.
 * @param {object} props - The component props.
 * @returns {React.Component} The component.
 */
export const LongTextArea = (props) => {
  return <Textarea {...props} minRows={2} />;
};

const Textarea = ({ name, value, onChange, placeholder, minRows }) => {
  const theme = useSelector(({ theme }) => theme);
  return (
    <TextareaAutosize
      name={name}
      minRows={minRows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={css[`textarea-${theme}`]}
    />
  );
};