// src/resolvers.js
const { container, TYPES } = require('../iocContainer');
const msgTemplateRepository = container.get(TYPES.MSG_TEMPLATE_REPOSITORY);

// start repo initialization
msgTemplateRepository.init();

const resolvers = {

  Mutation: {
    createMessageTemplate: async (root, input, ctx) => {
      console.log('input.messageTemplateInput :', input.messageTemplateInput);
      await msgTemplateRepository.putMsgTemplate(input.messageTemplateInput);
      return input.messageTemplateInput;
    },

    createBulkDelivery: async (_, { bulkDelieveryInput }) => {
      console.log(bulkDelieveryInput);
      /**
       * TODO
       * implement actual persistence
       */

      return {
        messageTemplateId: bulkDelieveryInput.messageTemplateId,
        numRecipients: bulkDelieveryInput.recipientIdList.length,
        messageId: bulkDelieveryInput.messageId
      }
    }
  },

};

module.exports = resolvers;
