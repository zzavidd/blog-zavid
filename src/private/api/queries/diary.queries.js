const { gql } = require('@apollo/client');

const diaryFragments = gql`
  fragment DiaryFields on DiaryEntry {
    id
    date
    content
    slug
    status
    entryNumber
  }
`;

exports.GET_DIARY_QUERY = gql`
  query GetAllDiaryEntries(
    $sort: DiarySortOptions
    $status: DiaryStatusOptions
  ) {
    diaryEntries(sort: $sort, status: $status) {
      ...DiaryFields
    }
  }
  ${diaryFragments}
`;

exports.GET_SINGLE_DIARY_QUERY = gql`
  query GetSingleDiaryEntry($id: Int!) {
    diaryEntry(id: $id) {
      ...DiaryFields
    }
  }
  ${diaryFragments}
`;

exports.CREATE_DIARY_QUERY = gql`
  mutation CreateDiaryEntry($diaryEntry: DiaryInput!, $isPublish: Boolean) {
    createDiaryEntry(diaryEntry: $diaryEntry, isPublish: $isPublish) {
      id
    }
  }
`;

exports.UPDATE_DIARY_QUERY = gql`
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

exports.DELETE_DIARY_QUERY = gql`
  mutation DeleteDiaryEntry($id: Int!) {
    deleteDiaryEntry(id: $id) {
      id
    }
  }
`;
