const { gql } = require('@apollo/client');

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

exports.GET_SUBSCRIBERS_QUERY = gql`
  query GetAllSubscribers($sort: SubscriberSortOptions) {
    subscribers(sort: $sort) {
      ...SubscriberFields
    }
  }
  ${subscriberFragments}
`;

exports.GET_SINGLE_SUBSCRIBER_QUERY = gql`
  query GetSingleSubscriber($id: Int!) {
    subscriber(id: $id) {
      ...SubscriberFields
    }
  }
  ${subscriberFragments}
`;

exports.CREATE_SUBSCRIBER_QUERY = gql`
  mutation CreateSubscriber($subscriber: SubscriberInput!) {
    createSubscriber(subscriber: $subscriber) {
      id
    }
  }
`;

exports.UPDATE_SUBSCRIBER_QUERY = gql`
  mutation UpdateSubscriber($id: Int!, $subscriber: SubscriberInput!) {
    updateSubscriber(id: $id, subscriber: $subscriber) {
      ...SubscriberFields
    }
  }
  ${subscriberFragments}
`;

exports.DELETE_SUBSCRIBER_QUERY = gql`
  mutation DeleteSubscriber($id: Int!) {
    deleteSubscriber(id: $id) {
      id
    }
  }
`;
