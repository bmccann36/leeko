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
  },

};

module.exports = resolvers;
