import { gql } from '@apollo/client';

const pageFragments = gql`
  fragment PageFields on Page {
    id
    title
    content
    excerpt
    slug
    isEmbed
    lastModified
  }
`;

export const GET_PAGES_QUERY = gql`
  query GetAllPages {
    pages {
      ...PageFields
    }
  }
  ${pageFragments}
`;

export const GET_SINGLE_PAGE_QUERY = gql`
  query GetSinglePage($id: Int!) {
    page(id: $id) {
      ...PageFields
    }
  }
  ${pageFragments}
`;

export const CREATE_PAGE_QUERY = gql`
  mutation CreatePage($page: PageInput!) {
    createPage(page: $page) {
      id
    }
  }
`;

export const UPDATE_PAGE_QUERY = gql`
  mutation UpdatePage($id: Int!, $page: PageInput!) {
    updatePage(id: $id, page: $page) {
      ...PageFields
    }
  }
  ${pageFragments}
`;

export const DELETE_PAGE_QUERY = gql`
  mutation DeletePage($id: Int!) {
    deletePage(id: $id) {
      id
    }
  }
`;
