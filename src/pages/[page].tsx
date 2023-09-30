import { Container, Stack, Typography } from '@mui/material';
import type { GetServerSideProps } from 'next';
import invariant from 'tiny-invariant';

import Paragraph from 'components/Typography/Paragraph';
import Layout from 'fragments/Layout';
import ZDate from 'utils/lib/date';
import * as ZText from 'utils/lib/text';
import Settings from 'utils/settings';
import { getServerSideHelpers } from 'utils/ssr';
import { trpc } from 'utils/trpc';

const DynamicPage: NextPageWithLayout<DynamicPageProps> = ({ params }) => {
  const { data: page } = trpc.page.find.useQuery(params);
  if (!page) return null;

  const substitutions = {
    lastModified: `**${ZDate.format(page.lastModified)}**`,
    myAge: ZDate.calculateZavidAge(),
    redevelopmentDate: ZDate.format(Settings.BLOG_REDEVELOPMENT_DATE),
  };

  return (
    <Container maxWidth={'sm'}>
      <Stack m={5} spacing={5}>
        <Typography variant={'h2'}>{page.title}</Typography>
        <Paragraph variant={'text'} substitutions={substitutions}>
          {page.content}
        </Paragraph>
      </Stack>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<DynamicPageProps> = async (
  ctx,
) => {
  try {
    const slug = ctx.query.page as string;
    const helpers = getServerSideHelpers(ctx);
    const params = { where: { slug } };

    const page = await helpers.page.find.fetch(params);
    invariant(page, 'No page found.');

    await helpers.page.find.prefetch(params);
    return {
      props: {
        params,
        pathDefinition: {
          title: `${page.title} | ${Settings.SITE_TITLE}`,
          description: ZText.extractExcerpt(page.content!),
          url: `/${slug}`,
        },
        trpcState: helpers.dehydrate(),
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

DynamicPage.getLayout = Layout.addPartials;
export default DynamicPage;

interface DynamicPageProps extends AppPageProps {
  params: PageFindInput;
}
