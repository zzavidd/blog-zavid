import { gql } from '@apollo/client';

const subscriberFragments = gql`
  fragment SubscriberFields on Subscriber {
    id
    email
    firstname
    lastname
    subscriptions {
      Reveries
      Diary
    }
    token
    createTime
  }
`;

export const GET_SUBSCRIBERS_QUERY = gql`
  query GetAllSubscribers($sort: SubscriberSortOptions) {
    subscribers(sort: $sort) {
      ...SubscriberFields
    }
  }
  ${subscriberFragments}
`;

export const GET_SINGLE_SUBSCRIBER_QUERY = gql`
  query GetSingleSubscriber($id: Int!) {
    subscriber(id: $id) {
      ...SubscriberFields
    }
  }
  ${subscriberFragments}
`;

export const CREATE_SUBSCRIBER_QUERY = gql`
  mutation CreateSubscriber($subscriber: SubscriberInput!) {
    createSubscriber(subscriber: $subscriber) {
      id
    }
  }
`;

export const UPDATE_SUBSCRIBER_QUERY = gql`
  mutation UpdateSubscriber($id: Int!, $subscriber: SubscriberInput!) {
    updateSubscriber(id: $id, subscriber: $subscriber) {
      ...SubscriberFields
    }
  }
  ${subscriberFragments}
`;

export const DELETE_SUBSCRIBER_QUERY = gql`
  mutation DeleteSubscriber($id: Int!) {
    deleteSubscriber(id: $id) {
      id
    }
  }
`;

export const CLEAR_SUBSCRIBERS_QUERY = gql`
  mutation ClearSubscribers {
    clearSubscribers
  }
`;
