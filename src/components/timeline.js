import React from 'react';

import { Icon } from 'components/icon';
import CloudImage, { ASPECT_RATIO } from 'components/image';
import { Title } from 'components/text';
import css from 'styles/components/Form.module.scss';

export const TIMELINE_TYPE = {
  REVERIE: { label: 'Reverie', segment: 'reveries' },
  DIARY: { label: 'Entry', segment: 'diary' }
};

export default ({ type, previous, next }) => {
  if (!previous.slug && !next.slug) return null;
  return (
    <div className={css['timeline']}>
      <PrevNextEntity type={type} entity={previous} isPrevious={true} />
      <PrevNextEntity type={type} entity={next} />
    </div>
  );
};

const PrevNextEntity = ({ entity = {}, isPrevious, type }) => {
  const prefix = isPrevious ? 'Previous' : 'Next';
  const { label, segment } = type;
  return (
    <a
      href={`/${segment}/${entity.slug}`}
      className={css[isPrevious ? 'timeline-previous' : 'timeline-next']}
      style={{ visibility: entity.slug ? 'visible' : 'hidden' }}>
      <div className={css['timeline-content']}>
        <Icon name={isPrevious ? 'chevron-left' : 'chevron-right'} />
        <div className={css['timeline-text']}>
          <Title>
            {prefix} {label}
          </Title>
          <div>{entity.label}</div>
        </div>
      </div>
      <EntityImage image={entity.image} />
    </a>
  );
};

const EntityImage = ({ image }) => {
  if (!image) return null;
  return (
    <CloudImage
      src={image}
      containerClassName={css['timeline-image-container']}
      imageClassName={css['timeline-image']}
      aspectRatio={ASPECT_RATIO.WIDE}
    />
  );
};
