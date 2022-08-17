import type { PageDAO } from 'classes';
import { PageQueryBuilder } from 'classes';
import { knex } from 'src/private/db';

export async function getPageBySlugSSR(slug: string, isEmbed = false) {
  const page = await getPageBySlug(slug, isEmbed);
  return JSON.stringify(page);
}

export async function getPageBySlug(
  slug: string,
  isEmbed?: boolean,
): Promise<PageDAO> {
  const builder = new PageQueryBuilder(knex).whereSlug(slug);
  if (isEmbed) {
    builder.whereIsEmbed(isEmbed);
  }
  const [page] = await builder.build();
  return page;
}