import type { GetStaticProps } from 'next';

import CurriculumVitae from 'fragments/Resources/CurriculumVitae/CurriculumVitae';

const CurriculumVitaePage: NextPageWithLayout<AppPageProps> = () => {
  return <CurriculumVitae />;
};

export const getStaticProps: GetStaticProps<AppPageProps> = () => {
  return {
    props: {
      pathDefinition: {
        title: "Zavid's Curriculum Vitae",
      },
    },
  };
};

export default CurriculumVitaePage;
