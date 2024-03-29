import { Stack, Typography, alpha, useTheme } from '@mui/material';
import type { Grid2Props } from '@mui/material/Unstable_Grid2';
import Grid from '@mui/material/Unstable_Grid2';
import { useContext, useEffect } from 'react';

import { normaliseText } from 'utils/lib/text';

import DiaryEachItem, { DiaryEachSkeleton } from '../DiaryEachItem';

import { DiaryIndexContext, useDiaryEntries } from './DiaryIndex.utils';

export default function DiaryCollection() {
  const { searchTerm } = useContext(DiaryIndexContext);
  const { data: diaryEntries, isLoading } = useDiaryEntries(searchTerm);

  useHighlightSearchTerms();

  const gridProps: Grid2Props = {
    columns: { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
    columnSpacing: { xs: 3, lg: 5 },
    container: true,
    rowSpacing: 3,
    width: '100%',
  };

  if (isLoading) {
    return (
      <Grid {...gridProps} width={'100%'}>
        {Array(10)
          .fill(null)
          .map((_, key) => (
            <DiaryEachSkeleton key={key} />
          ))}
      </Grid>
    );
  }

  if (!diaryEntries?.length) {
    return (
      <Stack py={9}>
        <Typography variant={'body1'} textAlign={'center'}>
          No diary entries found.
        </Typography>
      </Stack>
    );
  }

  return (
    <Grid {...gridProps}>
      {diaryEntries.map((entry) => (
        <DiaryEachItem entry={entry} searchTerm={searchTerm} key={entry.id} />
      ))}
    </Grid>
  );
}

function useHighlightSearchTerms() {
  const { searchTerm } = useContext(DiaryIndexContext);
  const { isLoading } = useDiaryEntries(searchTerm);
  const theme = useTheme();

  useEffect(() => {
    if (isLoading || !searchTerm) return;

    const highlightColor = alpha(theme.palette.primary.main, 0.5);
    const highlightStyle = `background-color:${highlightColor};border-radius:4px;font-size:90%;padding:0.2rem`;
    const paragraphs =
      document.querySelectorAll<HTMLParagraphElement>('pre p, span.title');
    paragraphs.forEach((p) => {
      const text = p.textContent!;

      const targetIndex = normaliseText(text, true).indexOf(
        normaliseText(searchTerm, true),
      );
      if (targetIndex < 0) return;

      const exactTerm = text.substring(
        targetIndex,
        targetIndex + searchTerm.length,
      );

      p.innerHTML = text
        .split(new RegExp(`(${exactTerm})`, 'i'))
        .map((phrase) => {
          const a = normaliseText(phrase, true);
          const b = normaliseText(searchTerm, true);
          if (a.includes(b)) {
            return `<span style="${highlightStyle}">${phrase}</span>`;
          }
          return /^\B/.test(phrase.trim()) ? phrase.trimStart() : phrase;
        })
        .join('');
      p.style.display = 'inline-table';
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, searchTerm]);
}
