import { EmailStyle, EmailTheme } from '../constants';

const Theme = EmailStyle.Color[EmailTheme];

export function Anchor({
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a rel={'noopener noreferrer'} {...props}>
      {children}
    </a>
  );
}

export function Paragraph({
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      style={{ fontSize: '0.85em', lineHeight: 1.6, marginBlock: '1.8em' }}
      {...props}>
      {children}
    </p>
  );
}

export function Blockquote({
  children,
  ...props
}: React.BlockquoteHTMLAttributes<HTMLElement>) {
  return (
    <blockquote
      {...props}
      style={{
        borderLeft: `5px solid ${Theme.Primary}`,
        borderRadius: '5px',
        color: Theme.Text,
        fontStyle: 'italic',
        fontSize: '0.85em',
        lineHeight: 1.6,
        margin: 0,
        padding: '0.5em 1.5em',
        ...props.style,
      }}>
      {children}
    </blockquote>
  );
}

export function Button({
  children,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      type={'button'}
      style={{
        background: Theme.Button,
        border: `1px solid ${Theme.Text}`,
        borderRadius: '10px',
        color: Theme.ButtonText,
        cursor: 'pointer',
        fontFamily: EmailStyle.Font,
        fontSize: '0.85em',
        fontWeight: 'bold',
        padding: '1.2em',
        textDecoration: 'none',
        ...props.style,
      }}>
      {children}
    </button>
  );
}
