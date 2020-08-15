const { gql } = require('@apollo/client');

exports.GET_POSTS_QUERY = gql`
  query GetAllPosts(
    $limit: Int
    $sort: PostOrder
    $type: PostType
  ) {
    getAllPosts(
      limit: $limit
      sort: $sort
      type: $type
    ) {
      id
      title
      type
      content
      status
      image
      datePublished
    }
  }
`;

exports.CREATE_POST_QUERY = gql`
  mutation CreatePost($post: PostInput!, $isPublish: Boolean = false) {
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
    $imagesHaveChanged: Boolean
  ) {
    updatePost(
      id: $id
      post: $post
      isPublish: $isPublish
      imagesHaveChanged: $imagesHaveChanged
    ) {
      id
    }
  }
`;

exports.DELETE_POST_QUERY = gql`
  mutation DeletePost($id: Int!) {
    deletePost(id: $id) {
      id
    }
  }
`;
