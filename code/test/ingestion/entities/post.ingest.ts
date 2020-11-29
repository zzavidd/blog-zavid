import * as faker from 'faker';
import { zDate, zString, zNumber } from 'zavid-modules';

import { fetch } from '../..';
import { PostBuilder, PostStatus, PostType } from '../../../classes';
import { CREATE_POST_QUERY } from '../../../src/private/api/queries/post.queries';
import { COUNT } from '../constants';

export const ingestReveries = () => {
  return ingestPost({
    startMessage: `Ingesting ${COUNT.REVERIE} reveries...`,
    endMessage: `Finished ingesting reveries.`,
    quantity: COUNT.REVERIE,
    postOptions: {
      generateTitle: () => faker.company.catchPhrase(),
      type: PostType.REVERIE,
      contentThreshold: 20,
      contentLimit: 25
    }
  });
};

export const ingestEpistles = () => {
  return ingestPost({
    startMessage: `Ingesting ${COUNT.EPISTLE} epistles...`,
    endMessage: 'Finished ingesting epistles.',
    quantity: COUNT.EPISTLE,
    postOptions: {
      generateTitle: (i) => {
        return `#${i}: ${faker.lorem.words(zNumber.generateRandom(1, 3))}`;
      },
      type: PostType.EPISTLE,
      contentThreshold: 3,
      contentLimit: 5
    }
  });
};

async function ingestPost(options: IngestPostOptions) {
  const {
    startMessage,
    endMessage,
    quantity = 0,
    postOptions: {
      generateTitle,
      type,
      contentThreshold = 1,
      contentLimit = 3,
      includeImage = true
    }
  } = options;

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
      .withStatus(PostStatus.PUBLISHED)
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

  await Promise.all(promises);
  console.info(endMessage);
}

interface IngestPostOptions {
  startMessage: string;
  endMessage: string;
  quantity: number;
  postOptions: {
    generateTitle: (index?: number) => string;
    type: PostType;
    contentThreshold: number;
    contentLimit: number;
    includeImage?: boolean;
  };
}
