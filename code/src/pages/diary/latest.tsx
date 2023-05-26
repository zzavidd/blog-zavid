import type { GetServerSideProps, NextPage } from 'next';

import DiaryAPI from 'server/api/diary';

const LatestDiaryEntryPage: NextPage = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { entryNumber } = await DiaryAPI.getLatest();
  return {
    redirect: {
      destination: `/diary/${entryNumber}`,
      permanent: false,
    },
  };
};

export default LatestDiaryEntryPage;
