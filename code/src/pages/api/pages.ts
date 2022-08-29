import type { PageDAO } from 'classes';
import { PageQueryBuilder } from 'classes';
import { knex } from 'constants/knex';

export async function getAllPagesSSR() {
  const pages = await new PageQueryBuilder(knex).build();
  return JSON.stringify(pages);
}

export async function getPageByIdSSR(id: number) {
  const [page] = await new PageQueryBuilder(knex).whereId(id).build();
  return JSON.stringify(page);
}

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
