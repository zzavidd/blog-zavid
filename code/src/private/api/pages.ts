import type { PageDAO } from 'classes';
import { PageQueryBuilder } from 'classes';
import { knex } from 'constants/knex';

namespace PageAPI {
  export function getAll() {
    return new PageQueryBuilder(knex).build();
  }

  export async function getById(id: number) {
    const [page] = await new PageQueryBuilder(knex).whereId(id).build();
    return page;
  }

  export async function getBySlug(
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
}

export default PageAPI;
