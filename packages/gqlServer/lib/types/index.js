// src/schema.js

const { gql } = require('apollo-server');

const types = gql`
  #  input MessageTemplateInput {
  #     messageBody: String!
  #     idList: [String]!
  #   }


    input MessageTemplateInput {
      encodedHtml: String!,
      templateId: String!
    }

    type MessageTemplate {
      encodedHtml: String!,
      templateId: String!
    }

    type Mutation {
      createMessageTemplate(
        messageTemplateInput: MessageTemplateInput
        ): MessageTemplate

    }
    type Query {
      getTemplate: MessageTemplate
    }



`;

module.exports = types;
