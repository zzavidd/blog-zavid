import express, { NextFunction, Request, Response } from 'express';
import { zText } from 'zavid-modules';

import {
  Operation,
  PageQueryBuilder,
  PostQueryBuilder,
  PostStatic,
  PostStatus,
  PostType
} from '../../../../classes';
import { siteTitle } from '../../../constants/settings';
import { PostService } from '../../api/service';
import { ERRORS, renderErrorPage } from '../../error';
import { getKnex, getServer } from '../../singleton';

const router = express.Router();
const knex = getKnex();
const server = getServer();

/** Route for list of reveries. */
router.get(
  '/reveries',
  async function (req: Request, res: Response, next: NextFunction) {
    const [reveriePage] = await new PageQueryBuilder(knex)
      .whereSlug('reveries')
      .build();
    if (!reveriePage) return next();

    return server.render(req, res, '/posts/reveries', {
      title: `Reveries | ${siteTitle}`,
      description: 'For my deeper ruminations...',
      ogUrl: '/reveries',
      reveriesIntro: reveriePage.content
    });
  },
  renderErrorPage
);

/** Route for reverie page. */
router.get(
  '/reveries/:slug',
  async function (req: Request, res: Response, next: NextFunction) {
    const { slug } = req.params;

    const [reverie] = await new PostQueryBuilder(knex)
      .whereSlug(slug)
      .whereType({ include: [PostType.REVERIE] })
      .whereStatus({ exclude: [PostStatus.DRAFT] })
      .build();

    const isUnauthorized =
      PostStatic.isProtected(reverie) && !req.isAuthenticated();

    if (!reverie || isUnauthorized) {
      return next(ERRORS.NO_ENTITY('reverie'));
    }

    const { type, typeId } = reverie;
    const [[previousReverie], [nextReverie]] = await Promise.all([
      new PostQueryBuilder(knex).getPreviousPost(typeId!, type!).build(),
      new PostQueryBuilder(knex).getNextPost(typeId!, type!).build()
    ]);

    return server.render(req, res, '/posts/single', {
      title: `${reverie.title} | ${siteTitle}`,
      description: reverie.excerpt,
      ogUrl: `/reveries/${slug}`,
      cardImage: reverie.image as string,
      post: JSON.stringify(reverie),
      previousPost: JSON.stringify(previousReverie),
      nextPost: JSON.stringify(nextReverie)
    });
  },
  renderErrorPage
);

/** Route for pages with reverie domains. */
router.get(
  '/reveries/:domain/:slug',
  async function (req: Request, res: Response, next: NextFunction) {
    const { domain, slug } = req.params;

    const [page] = await new PostQueryBuilder(knex)
      .whereStatus({ exclude: [PostStatus.DRAFT] })
      .whereDomainType(PostType.REVERIE)
      .whereDomainSlug(domain)
      .whereSlug(slug)
      .build();

    const isUnauthorized =
      PostStatic.isProtected(page) && !req.isAuthenticated();

    if (!page || isUnauthorized) {
      return next(ERRORS.NO_ENTITY('page'));
    }

    return server.render(req, res, '/posts/single', {
      title: `${page.title} | ${siteTitle}`,
      description: page.excerpt || zText.extractExcerpt(page.content!),
      ogUrl: `/reveries/${domain}/${slug}`,
      cardImage: page.image as string,
      post: JSON.stringify(page)
    });
  },
  renderErrorPage
);

// router.get('/epistles', function (req, res) {
//   return server.render(req, res, '/posts/epistles', {
//     title: `Epistles | ${siteTitle}`,
//     description:
//       'My messages, written to encourage and enlighten; typically based off of Bible scriptures and transcribed as poetry. Read and be blessed.',
//     ogUrl: '/epistles'
//   });
// });

router.get('/admin/posts', function (req, res) {
  return server.render(req, res, '/posts/admin', {
    title: `List of Posts`
  });
});

router.get('/admin/posts/add', function (req, res) {
  return server.render(req, res, '/posts/crud', {
    title: `Add New Post`,
    operation: Operation.CREATE
  });
});

router.get('/admin/posts/edit/:id', async function (req, res) {
  const id = parseInt(req.params.id);

  const post = await PostService.getSinglePost({ id });
  if (!post) throw ERRORS.NO_ENTITY('post');

  return server.render(req, res, '/posts/crud', {
    title: `Edit Post`,
    operation: Operation.UPDATE,
    post: JSON.stringify(post)
  });
});

export default router;
