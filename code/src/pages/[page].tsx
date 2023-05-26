import { Container, Stack, Typography } from '@mui/material';
import { createServerSideHelpers } from '@trpc/react-query/server';
import type { GetServerSideProps } from 'next';
import SuperJSON from 'superjson';

import { Paragraph } from 'components/Text';
import Settings from 'constants/settings';
import Layout from 'fragments/Layout';
import ZDate from 'lib/date';
import * as ZText from 'lib/text';
import { appRouter } from 'server/routers/_app';
import { trpc } from 'utils/trpc';

const DynamicPage: NextPageWithLayout<DynamicPageProps> = ({ slug }) => {
  const { data: page } = trpc.getPageBySlug.useQuery(slug);
  if (!page) return null;

  const substitutions = {
    lastModified: `**${ZDate.format(page.lastModified!)}**`,
    myAge: ZDate.calculateZavidAge(),
    redevelopmentDate: ZDate.format(Settings.BLOG_REDEVELOPMENT_DATE),
  };

  return (
    <Container>
      <Stack>
        <Typography variant={'h2'}>{page.title}</Typography>
        <Paragraph substitutions={substitutions}>{page.content}</Paragraph>
      </Stack>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<DynamicPageProps> = async (
  ctx,
) => {
  try {
    const helpers = createServerSideHelpers({
      ctx,
      router: appRouter,
      transformer: SuperJSON,
    });

    const slug = ctx.query.page as string;
    const page = await helpers.getPageBySlug.fetch(slug);
    return {
      props: {
        slug,
        pathDefinition: {
          title: `${page.title} | ${Settings.SITE_TITLE}`,
          description: ZText.extractExcerpt(page.content!),
          url: `/${slug}`,
        },
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
  slug: string;
}
