import { Container, Stack, Typography } from '@mui/material';
import type { GetServerSideProps } from 'next';
import invariant from 'tiny-invariant';

import Paragraph from 'componentsv2/Typography/Paragraph';
import Settings from 'constants/settings';
import Layout from 'fragments/Layout';
import ZDate from 'lib/date';
import * as ZText from 'lib/text';
import { getServerSideHelpers } from 'utils/ssr';
import { trpc } from 'utils/trpc';

const DynamicPage: NextPageWithLayout<DynamicPageProps> = ({ slug }) => {
  const { data: page } = trpc.page.find.useQuery({ where: { slug } });
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
        <Paragraph substitutions={substitutions}>{page.content}</Paragraph>
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
    const page = await helpers.page.find.fetch({ where: { slug } });
    invariant(page, 'No page found.');
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
