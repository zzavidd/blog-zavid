import type { PageDAO } from '../../../../classes';
import { PageMutationBuilder, PageQueryBuilder } from '../../../../classes';
import { ERRORS } from '../../error';
import { getKnex } from '../../singleton';

import { TryWrapper } from './helper';

const knex = getKnex();
const ENTITY_NAME = 'page';

/**
 * Retrieves all pages from database.
 */
export const getAllPages = (): Promise<PageDAO[]> => {
  return TryWrapper(async () => {
    const pages = await new PageQueryBuilder(knex).build();
    return pages;
  });
};

/**
 * Retrieves a single page from database.
 * @param options.id The ID of the page.
 */
export const getSinglePage = ({
  id,
}: GetOrDeletePageOptions): Promise<PageDAO> => {
  return TryWrapper(async () => {
    const [page] = await new PageQueryBuilder(knex).whereId(id).build();
    if (!page) throw ERRORS.NONEXISTENT_ID(id, ENTITY_NAME);
    return page;
  });
};

/**
 * Inserts a new page into the database.
 * @param option.page The page object to be inserted.
 */
export const createPage = ({ page }: CreatePageOptions): Promise<PageDAO> => {
  return TryWrapper(async () => {
    page.lastModified = new Date();
    const [id] = await new PageMutationBuilder(knex).insert(page).build();
    return { id };
  });
};

/**
 * Updates the fields of a page in the database.
 * @param args.id The ID of the page to update.
 * @param args.page The page object to be updated.
 */
export const updatePage = ({ id, page }: UpdatePageOptions) => {
  return TryWrapper(async () => {
    page.lastModified = new Date();
    await new PageMutationBuilder(knex).update(page).whereId(id).build();
    const updatedPage = await getSinglePage({ id });
    return updatedPage;
  });
};

/**
 * Deletes a page from the database.
 * @param args.id The ID of the page to delete.
 */
export const deletePage = ({ id }: GetOrDeletePageOptions) => {
  return TryWrapper(async () => {
    await getSinglePage({ id });
    await new PageMutationBuilder(knex).delete(id).build();
    return { id };
  });
};

export type GetOrDeletePageOptions = {
  id: number;
};

export type CreatePageOptions = {
  page: PageDAO;
};

export type UpdatePageOptions = {
  id: number;
  page: PageDAO;
};
