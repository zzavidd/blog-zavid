import { SendRounded } from '@mui/icons-material';
import type { TypographyProps } from '@mui/material';
import { Typography, useTheme } from '@mui/material';
import React, { useMemo } from 'react';

import { LinkButton } from 'components/Link';
import * as zText from 'utils/lib/text';

const Paragraph = React.forwardRef<HTMLPreElement, ParagraphProps>(
  function Paragraph(props, ref) {
    const {
      children,
      keepRichFormatOnTruncate,
      substitutions,
      moreHref = '#',
      moreText,
      truncate = 0,
      ...preProps
    } = props;
    const theme = useTheme();

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
          component={'pre'}
          whiteSpace={'pre-wrap'}
          mb={showReadMore ? 4 : 0}
          ref={ref}
          {...preProps}>
          {zText.formatText(text, { theme, typographyVariant: props.variant })}
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
