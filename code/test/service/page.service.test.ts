import { assert, testWrapper } from '..';
import { PageBuilder } from '../../classes';
import {
  comparePages,
  createPage,
  deletePage,
  getSinglePage,
  getPages,
  updatePage
} from '../helper/page.helper';

describe('Service Tests: Page', function () {
  describe('Get All Pages', function () {
    it(
      'All',
      testWrapper(async () => {
        const pages = await getPages();
        assert.isOk(pages);
      })
    );
  });

  describe('Create Page', function () {
    it(
      'Standard',
      testWrapper(async () => {
        const page = new PageBuilder().random().build();
        const createdPage = await createPage(page);
        const readPage = await getSinglePage(createdPage.id);

        comparePages(page, readPage);
        await deletePage(readPage.id!);
      })
    );
  });

  describe('Update Page', function () {
    it(
      'Standard',
      testWrapper(async () => {
        const pageToSubmit = new PageBuilder().random().build();
        const pageForUpdate = new PageBuilder().random().build();

        const createdPage = await createPage(pageToSubmit);
        const updatedPage = await updatePage(
          createdPage.id,
          pageForUpdate
        );

        comparePages(pageForUpdate, updatedPage);
        assert.strictEqual(createdPage.id, updatedPage.id!);
        await deletePage(createdPage.id);
      })
    );
  });
});
