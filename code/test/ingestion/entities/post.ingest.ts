const faker = require('faker');
const { zDate, zString, zNumber } = require('zavid-modules');

const {
  classes: { Post, PostBuilder },
  fetch
} = require('../..');
const {
  CREATE_POST_QUERY
} = require('../../../src/private/api/queries/post.queries');

const COUNT = {
  REVERIE: 10,
  EPISTLE: 20
};

exports.ingestReveries = () => {
  return ingestPost({
    startMessage: `Ingesting ${COUNT.EPISTLE} epistles...`,
    quantity: COUNT.REVERIE,
    postOptions: {
      generateTitle: () => faker.company.catchPhrase(),
      type: Post.TYPES.REVERIE.TITLE,
      contentThreshold: 20,
      contentLimit: 25
    }
  });
};

exports.ingestEpistles = () => {
  return ingestPost({
    startMessage: `Ingesting ${COUNT.EPISTLE} epistles...`,
    quantity: COUNT.EPISTLE,
    postOptions: {
      generateTitle: (i) => {
        return `#${i}: ${faker.lorem.words(zNumber.generateRandom(1, 3))}`;
      },
      type: Post.TYPES.EPISTLE.TITLE,
      contentThreshold: 3,
      contentLimit: 5
    }
  });
};

const ingestPost = (options: IngestPostOptions) => {
  const {
    startMessage,
    quantity = 0,
    postOptions: {
      generateTitle,
      type,
      contentThreshold = 1,
      contentLimit = 3,
      includeImage = true
    }
  } = options;

  return new Promise((resolve, reject) => {
    console.info(startMessage);

    const promises = [];
    let refDate = new Date();

    for (let i = 0; i < quantity; i++) {
      refDate = faker.date.future(1, refDate);
      const index = i + 1;
      let postbuilder = new PostBuilder()
        .withTitle(zString.toTitleCase(generateTitle(index)))
        .withType(type)
        .withTypeId(index)
        .withContent(
          faker.lorem.paragraphs(
            zNumber.generateRandom(contentThreshold, contentLimit)
          )
        )
        .withStatus(Post.STATUSES.PUBLISHED)
        .withDatePublished(zDate.formatISODate(refDate))
        .withRandomExcerpt();

      if (includeImage) postbuilder = postbuilder.withRandomImage();

      const post = postbuilder.build();

      promises.push(
        fetch(CREATE_POST_QUERY, {
          variables: { post, isTest: true }
        })
      );
    }

    Promise.all(promises)
      .then(() => resolve())
      .catch(reject);
  });
};

interface IngestPostOptions {
  startMessage: string;
  quantity: number;
  postOptions: {
    generateTitle: (index?: number) => string;
    type: string;
    contentThreshold: number;
    contentLimit: number;
    includeImage?: boolean;
  };
}

export {};
