const { gql } = require('@apollo/client');

const pageFragments = gql`
  fragment PageFields on Page {
    id
    title
    content
    excerpt
    slug
    editTitle
    editPlaceholderText
    lastModified
  }
`;

exports.GET_PAGES_QUERY = gql`
  query GetAllPages {
    pages {
      ...PageFields
    }
  }
  ${pageFragments}
`;

exports.GET_SINGLE_PAGE_QUERY = gql`
  query GetSinglePage($id: Int!) {
    page(id: $id) {
      ...PageFields
    }
  }
  ${pageFragments}
`;

exports.CREATE_PAGE_QUERY = gql`
  mutation CreatePage($page: PageInput!) {
    createPage(page: $page) {
      id
    }
  }
`;

exports.UPDATE_PAGE_QUERY = gql`
  mutation UpdatePage($id: Int!, $page: PageInput!) {
    updatePage(id: $id, page: $page) {
      ...PageFields
    }
  }
  ${pageFragments}
`;

exports.DELETE_PAGE_QUERY = gql`
  mutation DeletePage($id: Int!) {
    deletePage(id: $id) {
      id
    }
  }
`;
