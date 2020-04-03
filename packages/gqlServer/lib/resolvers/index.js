// src/resolvers.js

const resolvers = {

  Mutation: {
    createBulkMessage: async (root, bulkMessageInput, ctx) => {
      console.log('bulkMessageInput :', bulkMessageInput);
      return 'done';
    },
  },

};

module.exports = resolvers;
