import * as PageService from '../service/page.service';

/**
 * Retrieves all pages from database.
 */
const getAllPages = () => {
  return PageService.getAllPages();
};

/**
 * Retrieves a single page from database.
 */
const getSinglePage = (
  parent: unknown,
  args: PageService.GetOrDeletePageOptions,
) => PageService.getSinglePage(args);

/**
 * Inserts a new page into the database.
 */
const createPage = (parent: unknown, args: PageService.CreatePageOptions) =>
  PageService.createPage(args);

/**
 * Updates the fields of a page in the database.
 */
const updatePage = (parent: unknown, args: PageService.UpdatePageOptions) =>
  PageService.updatePage(args);
/**
 * Deletes a page from the database.
 */
const deletePage = (
  parent: unknown,
  args: PageService.GetOrDeletePageOptions,
) => PageService.deletePage(args);

export default {
  Query: {
    pages: getAllPages,
    page: getSinglePage,
  },
  Mutation: {
    createPage,
    updatePage,
    deletePage,
  },
};
