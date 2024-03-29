import { SendRounded } from '@mui/icons-material';
import type { TypographyProps } from '@mui/material';
import { Stack, Typography, useTheme } from '@mui/material';
import React, { useMemo } from 'react';

import { Link } from 'components/Link';
import * as zText from 'utils/lib/text';

const Paragraph = React.forwardRef<HTMLPreElement, ParagraphProps>(
  function Paragraph(
    {
      children,
      dataTestId,
      moreHref = '#',
      moreText,
      readMoreDataTestId,
      truncate = 0,
      TypographyProps,
      variant,
      ...props
    },
    ref,
  ) {
    const theme = useTheme();

    const text = useMemo(() => {
      const result = truncate
        ? zText.truncateText(children as string, {
            limit: truncate,
            keepRichFormatting: props.keepRichFormatOnTruncate,
          })
        : children;

      if (props.substitutions) {
        return zText.applySubstitutions(result, props.substitutions);
      }

      return result;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [children]);

    const showReadMore = !!moreText && text.length > truncate;

    return (
      <React.Fragment>
        <Typography
          variant={variant}
          component={'pre'}
          whiteSpace={'pre-wrap'}
          pb={showReadMore ? 4 : 0}
          onContextMenu={(e: any) => e.preventDefault()}
          ref={ref}
          sx={{ ...props.sx, userSelect: 'none' }}
          {...props}>
          {zText.formatText(text, {
            dataTestId,
            theme,
            TypographyProps: {
              variant,
              ...TypographyProps,
            },
          })}
        </Typography>
        {showReadMore ? (
          <Stack direction={'row'} alignItems={'center'} columnGap={1}>
            <SendRounded color={'primary'} fontSize={'small'} />
            <Link
              href={moreHref}
              sx={{ fontSize: 14 }}
              data-testid={readMoreDataTestId}>
              {moreText}
            </Link>
          </Stack>
        ) : null}
      </React.Fragment>
    );
  },
);

export default Paragraph;

interface ParagraphProps extends TypographyProps<'pre'> {
  children: string;
  dataTestId?: string;
  keepRichFormatOnTruncate?: true;
  moreText?: string;
  moreHref?: string;
  readMoreDataTestId?: string;
  substitutions?: Record<string, string | number>;
  truncate?: number;
  TypographyProps?: TypographyProps<'p'>;
}
