import type { GetServerSideProps } from 'next';

import Settings from 'constants/settings';
import Layout from 'fragments/Layout';
import ZDate from 'lib/date';
import * as ZText from 'lib/text';
import SSR from 'private/ssr';
import PageStyle from 'styles/Pages/Page.styles';

// eslint-disable-next-line react/function-component-definition
const PageSingle: NextPageWithLayout<PageSingleProps> = ({ pageProps }) => {
  const { page } = pageProps;
  const substitutions = {
    lastModified: `**${ZDate.format(page.lastModified!)}**`,
    myAge: ZDate.calculateZavidAge(),
    redevelopmentDate: ZDate.format(Settings.BLOG_REDEVELOPMENT_DATE),
  };

  return (
    <PageStyle.Container>
      <PageStyle.Main>
        <PageStyle.Title>{page.title}</PageStyle.Title>
        <PageStyle.Content substitutions={substitutions}>
          {page.content}
        </PageStyle.Content>
      </PageStyle.Main>
    </PageStyle.Container>
  );
};

export const getServerSideProps: GetServerSideProps<PageSingleProps> = async ({
  query,
}) => {
  try {
    const page = JSON.parse(await SSR.Pages.getBySlug(query.page as string));
    return {
      props: {
        pathDefinition: {
          title: `${page.title} | ${Settings.SITE_TITLE}`,
          description: ZText.extractExcerpt(page.content!),
          url: `/${query.page}`,
        },
        pageProps: {
          page,
        },
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

PageSingle.getLayout = Layout.addPartials;
export default PageSingle;

interface PageSingleProps {
  pathDefinition: PathDefinition;
  pageProps: {
    page: PageDAO;
  };
}
