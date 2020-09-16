const diaryResolvers = require('./diary.resolvers');
const pageResolvers = require('./page.resolvers');
const postResolvers = require('./post.resolvers');
const subscriberResolvers = require('./subscriber.resolvers');

const resolvers = [
  diaryResolvers,
  pageResolvers,
  postResolvers,
  subscriberResolvers
];

const Query = {};
const Mutation = {};

// For merging all queries and mutations.
resolvers.forEach((resolver) => {
  Object.assign(Query, resolver.Query);
  Object.assign(Mutation, resolver.Mutation);
});

module.exports = { Query, Mutation };
