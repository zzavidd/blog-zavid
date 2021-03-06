import { gql } from '@apollo/client';

const diaryFragments = gql`
  fragment DiaryFields on DiaryEntry {
    id
    title
    date
    content
    footnote
    slug
    status
    entryNumber
    isFavourite
    tags
  }
`;

export const GET_DIARY_QUERY = gql`
  query GetAllDiaryEntries(
    $sort: DiarySortOptions
    $status: DiaryStatusOptions
    $onlyFavourites: Boolean
  ) {
    diaryEntries(
      sort: $sort
      status: $status
      onlyFavourites: $onlyFavourites
    ) {
      ...DiaryFields
    }
  }
  ${diaryFragments}
`;

export const GET_SINGLE_DIARY_QUERY = gql`
  query GetSingleDiaryEntry($id: Int!) {
    diaryEntry(id: $id) {
      ...DiaryFields
    }
  }
  ${diaryFragments}
`;

export const CREATE_DIARY_QUERY = gql`
  mutation CreateDiaryEntry($diaryEntry: DiaryInput!, $isPublish: Boolean) {
    createDiaryEntry(diaryEntry: $diaryEntry, isPublish: $isPublish) {
      id
    }
  }
`;

export const UPDATE_DIARY_QUERY = gql`
  mutation UpdateDiaryEntry(
    $id: Int!
    $diaryEntry: DiaryInput!
    $isPublish: Boolean
  ) {
    updateDiaryEntry(id: $id, diaryEntry: $diaryEntry, isPublish: $isPublish) {
      ...DiaryFields
    }
  }
  ${diaryFragments}
`;

export const DELETE_DIARY_QUERY = gql`
  mutation DeleteDiaryEntry($id: Int!) {
    deleteDiaryEntry(id: $id) {
      id
    }
  }
`;

export const CLEAR_DIARY_QUERY = gql`
  mutation ClearDiary {
    clearDiary
  }
`;
