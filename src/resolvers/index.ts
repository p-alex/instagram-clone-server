const resolvers = {
  Query: {
    posts: (_: undefined, __: {}) => {
      return [];
    },
  },
};
export default resolvers;
