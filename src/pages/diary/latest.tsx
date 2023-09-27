import { DiaryStatus } from '@prisma/client';
import type { GetServerSideProps, NextPage } from 'next';
import invariant from 'tiny-invariant';

import DiaryAPI from 'server/api/diary';

const LatestDiaryEntryPage: NextPage = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const entry = await DiaryAPI.find({
      orderBy: { entryNumber: 'desc' },
      where: { status: DiaryStatus.PUBLISHED },
    });
    invariant(entry, 'No diary entry found.');
    return {
      redirect: {
        destination: `/diary/${entry.entryNumber}`,
        permanent: false,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default LatestDiaryEntryPage;
