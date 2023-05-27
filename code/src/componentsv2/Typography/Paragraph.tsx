import { SendRounded } from '@mui/icons-material';
import type { TypographyProps } from '@mui/material';
import { Typography } from '@mui/material';
import React, { useMemo } from 'react';

import { LinkButton } from 'componentsv2/Link';
import * as zText from 'lib/text';

const Paragraph = React.forwardRef<HTMLPreElement, ParagraphProps>(
  (props, ref) => {
    const {
      children,
      keepRichFormatOnTruncate,
      substitutions,
      moreHref = '#',
      moreText,
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

    const showReadMore = !!moreText && text.length > truncate;

    return (
      <React.Fragment>
        <Typography
          variant={'body1'}
          component={'pre'}
          whiteSpace={'pre-wrap'}
          ref={ref}
          mb={showReadMore ? 3 : 0}
          {...preProps}>
          {zText.formatText(text)}
        </Typography>
        {showReadMore ? (
          <LinkButton
            href={moreHref}
            startIcon={<SendRounded fontSize={'small'} />}>
            {moreText}
          </LinkButton>
        ) : null}
      </React.Fragment>
    );
  },
);

export default Paragraph;

interface ParagraphProps extends TypographyProps<'pre'> {
  children: string;
  keepRichFormatOnTruncate?: true;
  moreText?: string;
  moreHref?: string;
  substitutions?: Record<string, string | number>;
  truncate?: number;
}
