const { gql } = require('@apollo/client');

const diaryFragments = gql`
  fragment DiaryFields on Diary {
    id
    date
    content
    slug
    status
  }
`;

exports.GET_DIARY_QUERY = gql`
  query GetAllDiaryEntries() {
    diaryEntries() {
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
  mutation CreateDiaryEntry($entry: DiaryInput!, $isPublish: Boolean) {
    createDiaryEntry(entry: $entry, isPublish: $isPublish) {
      id
    }
  }
`;

exports.UPDATE_DIARY_QUERY = gql`
  mutation UpdateDiaryEntry(
    $id: Int!
    $entry: DiaryInput!
    $isPublish: Boolean
  ) {
    updateDiaryEntry(id: $id, entry: $entry, isPublish: $isPublish) {
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
