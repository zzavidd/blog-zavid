export enum IDiaryStatus {
  PROTECTED = 'PROTECTED',
  PRIVATE = 'PRIVATE',
  PUBLISHED = 'PUBLISHED',
}

export enum IPostStatus {
  DRAFT = 'DRAFT',
  PROTECTED = 'PROTECTED',
  PRIVATE = 'PRIVATE',
  PUBLISHED = 'PUBLISHED',
}

export enum IPostType {
  REVERIE = 'Reverie',
  EPISTLE = 'Epistle',
  POEM = 'Poem',
  MUSING = 'Musing',
  PAGE = 'Page',
}

export enum ISubscriptionType {
  Reverie = 'Reveries',
  Diary = 'Diary',
}

export enum QueryOrder {
  ASCENDING = 'ASC',
  DESCENDING = 'DESC',
  RANDOM = 'RANDOM',
}
