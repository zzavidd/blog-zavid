import express from 'express';
import { zText } from 'zavid-modules';

import { Operation, PageQueryBuilder } from '../../../../classes';
import { siteTitle } from '../../../settings';
import { PageService } from '../../api/service';
import { getKnex, getServer } from '../../singleton';

const router = express.Router();
const knex = getKnex();
const server = getServer();

router.get('/:slug', async function (req, res, next) {
  const { slug } = req.params;

  const [page] = await new PageQueryBuilder(knex)
    .whereSlug(slug)
    .whereIsEmbed(false)
    .build();
  if (!page) return next();

  return server.render(req, res, '/pages/single', {
    title: `${page.title} | ${siteTitle}`,
    description: zText.extractExcerpt(page.content!),
    ogUrl: `/${slug}`,
    page: JSON.stringify(page)
  });
});

router.get('/admin/pages', function (req, res) {
  return server.render(req, res, '/pages/admin', {
    title: `List of Pages`
  });
});

router.get('/admin/pages/add', function (req, res) {
  return server.render(req, res, '/pages/crud', {
    title: `Add New Page`,
    operation: Operation.CREATE
  });
});

router.get('/admin/pages/edit/:id', async function (req, res) {
  const id = parseInt(req.params.id);
  const page = await PageService.getSinglePage({ id });
  return server.render(req, res, '/pages/crud', {
    title: `Edit Page`,
    operation: Operation.UPDATE,
    page: JSON.stringify(page)
  });
});

export default router;
