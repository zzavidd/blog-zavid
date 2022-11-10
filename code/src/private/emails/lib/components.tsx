import { EmailStyle } from '../constants';

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

export function Button({
  children,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      type={'button'}
      style={{
        background: EmailStyle.Color.Primary,
        border: `1px solid ${EmailStyle.Color.White}`,
        borderRadius: '10px',
        color: EmailStyle.Color.White,
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
