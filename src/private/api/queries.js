const { gql } = require('@apollo/client');

const postFragments = gql`
  fragment PostFields on Post {
    id
    title
    type
    content
    status
    image
    datePublished
    excerpt
    slug
    createTime
    domainId
    domainType
  }
`;

exports.GET_POSTS_QUERY = gql`
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

exports.GET_SINGLE_POST_QUERY = gql`
  query GetSinglePost($id: Int!) {
    getSinglePost(id: $id) {
      ...PostFields
    }
  }
  ${postFragments}
`;

exports.CREATE_POST_QUERY = gql`
  mutation CreatePost($post: PostInput!, $isPublish: Boolean) {
    createPost(post: $post, isPublish: $isPublish) {
      id
    }
  }
`;

exports.UPDATE_POST_QUERY = gql`
  mutation UpdatePost(
    $id: Int!
    $post: PostInput!
    $isPublish: Boolean
    $imageHasChanged: Boolean
  ) {
    updatePost(
      id: $id
      post: $post
      isPublish: $isPublish
      imageHasChanged: $imageHasChanged
    ) {
      ...PostFields
    }
  }
  ${postFragments}
`;

exports.DELETE_POST_QUERY = gql`
  mutation DeletePost($id: Int!) {
    deletePost(id: $id) {
      id
    }
  }
`;
