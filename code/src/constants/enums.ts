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

export enum IWishlistItemCategory {
  ARTWORK = 'Artwork',
  CLOTHING = 'Clothing',
  CONFECTIONERY = 'Confectionery',
  COSMETICS = 'Cosmetics',
  GAMING = 'Gaming',
  ELECTRONICS = 'Electronics',
  HOUSEHOLD = 'Household',
}

export enum IWishlistItemVisibility {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
}

export enum IWishlistItemPriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

export const WishlistDisplayedPriority = {
  [IWishlistItemPriority.LOW]: 'Wanted',
  [IWishlistItemPriority.MEDIUM]: 'Desired',
  [IWishlistItemPriority.HIGH]: 'Needed',
};

export enum QueryOrder {
  ASCENDING = 'ASC',
  DESCENDING = 'DESC',
  RANDOM = 'RANDOM',
}
