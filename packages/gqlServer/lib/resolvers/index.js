

const resolvers = {

  Mutation: {
    createMessageTemplate: async (_, input, ctx) => {
      const { msgTemplateRepository } = ctx;
      // console.log('ctx :', msgTemplateRepository);
      console.log('input.messageTemplateInput :', input.messageTemplateInput);
      await msgTemplateRepository.putMsgTemplate(input.messageTemplateInput);
      return input.messageTemplateInput;
    },

    createBulkDelivery: async (_, { bulkDelieveryInput }, ctx) => {
      console.log("bulk delivery resolver invoked");
      const { bulkMessageService } = ctx;
      bulkMessageService.sendToRecipients(bulkDelieveryInput);

      return {
        messageTemplateId: bulkDelieveryInput.messageTemplateId,
        numRecipients: bulkDelieveryInput.recipientIdList.length,
        messageId: bulkDelieveryInput.messageId
      }
    }
  },

};

module.exports = resolvers;
