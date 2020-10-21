const faker = require('faker');
const { zDate, zString } = require('zavid-modules');

const { assert, debug, fetch } = require('.');
const { Post, PostBuilder } = require('../classes');
const { CREATE_POST_QUERY } = require('../private/api/queries/post.queries');

const INGESTION_COUNT_EPISTLE = 20;

const ingestEpistles = () => {
  const promises = [];
  let refDate = new Date();
  
  for (let i = 0; i < INGESTION_COUNT_EPISTLE; i++) {
    refDate = faker.date.future(1, refDate);
    const index = i + 1;
    const epistle = new PostBuilder()
      .random({ withImage: true })
      .withTitle(
        `#${index}: ${zString.toTitleCase(
          faker.lorem.words(Math.floor(Math.random() * 3) + 1)
        )}`
      )
      .withType(Post.TYPES.EPISTLE.TITLE)
      .withTypeId(index)
      .withStatus(Post.STATUSES.PUBLISHED)
      .withDatePublished(zDate.formatISODate(refDate))
      .build();

    promises.push(
      Promise.resolve()
        .then(() => {
          return fetch(
            CREATE_POST_QUERY,
            {
              variables: { post: epistle, isTest: true }
            },
            function ({ errors }) {
              assert.isNotOk(errors);
            }
          );
        })
        .catch(debug)
    );
  }

  promises.reduce((promiseChain, currentTask) => {
    return promiseChain.then(currentTask);
  });

  console.info(`Successfully ingested ${INGESTION_COUNT_EPISTLE} epistles.`);
};

ingestEpistles();
