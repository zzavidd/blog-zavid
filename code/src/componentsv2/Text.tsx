import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { useMemo } from 'react';

import * as zText from 'lib/text';
import TextStyle from 'stylesv2/Components/Text.styles';

export function Paragraph({
  children,
  keepRichFormatOnTruncate,
  more,
  truncate = 0,
  substitutions,
  ...props
}: ParagraphProps) {
  const text = useMemo(() => {
    const result = truncate
      ? zText.truncateText(children as string, {
          limit: truncate,
          keepRichFormatting: keepRichFormatOnTruncate,
        })
      : children;

    if (substitutions) {
      return zText.applySubstitutions(result, substitutions);
    }

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  return (
    <React.Fragment>
      <TextStyle.Collection {...props}>
        {zText.formatText(text)}
      </TextStyle.Collection>
      {more && text.length > truncate ? (
        <Link href={more.href}>
          <TextStyle.Section.ReadMore>
            <FontAwesomeIcon icon={faPaperPlane} />
            <span>{more.text}</span>
          </TextStyle.Section.ReadMore>
        </Link>
      ) : null}
    </React.Fragment>
  );
}

interface ParagraphProps extends React.HTMLAttributes<HTMLPreElement> {
  children: string;
  keepRichFormatOnTruncate?: true;
  more?: {
    text: string;
    href: string;
  };
  substitutions?: Record<string, string | number>;
  truncate?: number;
}
