import type { Page } from '@prisma/client';

import prisma from 'server/prisma';

namespace PageAPI {
  export function getAll({ isEmbed }: GetAllPageParams = {}) {
    return prisma.page.findMany({ where: { isEmbed } });
  }

  export function getById(id: number) {
    return prisma.page.findFirstOrThrow({ where: { id } });
  }

  export function getBySlug(slug: string, isEmbed?: boolean): Promise<Page> {
    return prisma.page.findFirstOrThrow({
      where: { slug, isEmbed },
    });
  }

  // export async function create({ page }: CreatePagePayload) {
  //   await new PageMutationBuilder(knex).insert(page).build();
  // }

  // export async function update({ id, page }: UpdatePagePayload) {
  //   await new PageMutationBuilder(knex).update(page).whereId(id).build();
  // }

  // export async function del({ id }: DeletePagePayload) {
  //   await new PageMutationBuilder(knex).delete(id).build();
  // }
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
