import type { PageDAO } from 'classes/pages/PageDAO';
import { PageQueryBuilder } from 'classes/pages/PageQueryBuilder';
import { knex } from 'constants/knex';

namespace PageAPI {
  export function getAll({ isEmbed = true }: GetAllPageParams) {
    return new PageQueryBuilder(knex).whereIsEmbed(isEmbed).build();
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

export interface GetAllPageParams {
  isEmbed: boolean;
}
