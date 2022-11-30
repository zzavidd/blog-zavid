import {
  PageMutationBuilder,
  PageQueryBuilder,
} from 'classes/pages/PageQueryBuilder';
import { knex } from 'constants/knex';

namespace PageAPI {
  export function getAll({ isEmbed }: GetAllPageParams = {}) {
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

  export async function create({ page }: CreatePagePayload) {
    await new PageMutationBuilder(knex).insert(page).build();
  }

  export async function update({ id, page }: UpdatePagePayload) {
    await new PageMutationBuilder(knex).update(page).whereId(id).build();
  }

  export async function del({ id }: DeletePagePayload) {
    await new PageMutationBuilder(knex).delete(id).build();
  }
}

export default PageAPI;

export interface GetAllPageParams {
  isEmbed?: boolean;
}

export interface CreatePagePayload {
  page: PageDAO;
}

export interface UpdatePagePayload {
  id: number;
  page: PageDAO;
}

export interface DeletePagePayload {
  id: number;
}
