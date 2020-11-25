import { gql } from '@apollo/client';

const postFragments = gql`
  fragment PostFields on Post {
    id
    title
    type
    typeId
    content
    status
    image
    contentImages
    datePublished
    excerpt
    slug
    createTime
    domainId
    domainTitle
    domainType
    domainSlug
  }
`;

export const GET_POSTS_QUERY = gql`
  query GetAllPosts(
    $limit: Int
    $sort: PostSortOptions
    $type: PostTypeOptions
    $status: PostStatusOptions
  ) {
    getAllPosts(limit: $limit, sort: $sort, type: $type, status: $status) {
      ...PostFields
    }
  }
  ${postFragments}
`;

export const GET_SINGLE_POST_QUERY = gql`
  query GetSinglePost($id: Int!) {
    getSinglePost(id: $id) {
      ...PostFields
    }
  }
  ${postFragments}
`;

export const CREATE_POST_QUERY = gql`
  mutation CreatePost(
    $post: PostInput!
    $isPublish: Boolean
    $isTest: Boolean
  ) {
    createPost(post: $post, isPublish: $isPublish, isTest: $isTest) {
      id
    }
  }
`;

export const UPDATE_POST_QUERY = gql`
  mutation UpdatePost(
    $id: Int!
    $post: PostInput!
    $isPublish: Boolean
    $isTest: Boolean
  ) {
    updatePost(id: $id, post: $post, isPublish: $isPublish, isTest: $isTest) {
      ...PostFields
    }
  }
  ${postFragments}
`;

export const DELETE_POST_QUERY = gql`
  mutation DeletePost($id: Int!) {
    deletePost(id: $id) {
      id
    }
  }
`;

export const TRUNCATE_POST_TABLE_QUERY = gql`
  mutation TruncatePostTable {
    truncatePostTable
  }
`;
