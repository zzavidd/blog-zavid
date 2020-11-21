import diaryResolvers from './diary.resolvers';
import pageResolvers from './page.resolvers';
import postResolvers from './post.resolvers';
import subscriberResolvers from './subscriber.resolvers';

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

export default { Query, Mutation };
