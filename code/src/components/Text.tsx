import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from '@mui/material';
import React, { useMemo } from 'react';

import * as zText from 'lib/text';
import TextStyle from 'styles/Components/Text.styles';

export const Paragraph = React.forwardRef<HTMLPreElement, ParagraphProps>(
  (props, ref) => {
    const {
      children,
      keepRichFormatOnTruncate,
      more,
      substitutions,
      truncate = 0,
      ...preProps
    } = props;

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
        <Typography variant={'body1'} component={'pre'} ref={ref} {...preProps}>
          {zText.formatText(text)}
        </Typography>
        {more && text.length > truncate ? (
          <TextStyle.Section.ReadMore href={more.href}>
            <FontAwesomeIcon icon={faPaperPlane} />
            <span>{more.text}</span>
          </TextStyle.Section.ReadMore>
        ) : null}
      </React.Fragment>
    );
  },
);

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
