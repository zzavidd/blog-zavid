import type { GetServerSideProps, NextPage } from 'next';

import type { DiaryDAO } from 'classes/diary/DiaryDAO';
import SSR from 'private/ssr';

// eslint-disable-next-line react/function-component-definition
const LatestDiaryEntryPage: NextPage = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const latestDiaryEntry = JSON.parse(await SSR.Diary.getLatest()) as DiaryDAO;
  return {
    redirect: {
      destination: `/diary/${latestDiaryEntry.entryNumber}`,
      permanent: false,
    },
  };
};

export default LatestDiaryEntryPage;
