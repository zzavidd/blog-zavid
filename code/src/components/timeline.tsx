import React from 'react';

import { Icon } from 'src/lib/library';
import css from 'src/styles/components/Form.module.scss';

import CloudImage, { AspectRatio } from './image';
import { Title, VanillaLink } from './text';

export const TimelineType: TimelineTypes = {
  REVERIE: { label: 'Reverie', segment: 'reveries' },
  EPISTLE: { label: 'Epistle', segment: 'epistles' },
  DIARY: { label: 'Entry', segment: 'diary' }
};

export default ({ type, previous, next }: Timeline) => {
  if (!previous?.slug && !next?.slug) return null;
  return (
    <div className={css['timeline']}>
      <PrevNextEntity type={type} entity={previous} isPrevious={true} />
      <PrevNextEntity type={type} entity={next} />
    </div>
  );
};

const PrevNextEntity = ({
  entity = {},
  isPrevious,
  type
}: PrevNextEntityProps) => {
  const prefix = isPrevious ? 'Previous' : 'Next';
  const { label, segment } = type!;
  return (
    <VanillaLink
      href={`/${segment}/${entity.slug}`}
      className={css[isPrevious ? 'timeline-previous' : 'timeline-next']}
      style={{ visibility: entity.slug ? 'visible' : 'hidden' }}>
      <div className={css['timeline-content']}>
        <Icon name={isPrevious ? 'chevron-left' : 'chevron-right'} />
        <div className={css['timeline-text']}>
          <Title className={css['timeline-text-heading']}>
            <>
              {prefix} {label}
            </>
          </Title>
          <div>{entity.label}</div>
        </div>
      </div>
      <EntityImage image={entity.image} />
    </VanillaLink>
  );
};

const EntityImage = ({ image }: EntityImage) => {
  if (!image) return null;
  return (
    <CloudImage
      src={image}
      containerClassName={css['timeline-image-container']}
      imageClassName={css['timeline-image']}
      aspectRatio={AspectRatio.WIDE}
    />
  );
};

interface Timeline {
  type: TimelineType;
  previous?: TimelineEntity;
  next?: TimelineEntity;
}

interface PrevNextEntityProps {
  entity: TimelineEntity | undefined;
  isPrevious?: boolean;
  type?: TimelineType;
}

interface TimelineEntity {
  label?: string;
  slug?: string;
  image?: string;
}

interface TimelineTypes {
  [key: string]: TimelineType;
}

interface TimelineType {
  label: string;
  segment: string;
}

interface EntityImage {
  image: string | undefined;
}
