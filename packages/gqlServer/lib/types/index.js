// src/schema.js

const { gql } = require('apollo-server');

const types = gql`
   input BulkDeliveryInput {
      messageTemplateId: String!
      recipientIdList: [String]!
      messageId: String
    }

    type BulkDeliveryInfo {
      messageTemplateId: String!
      numRecipients: Int!
      messageId: String!
    }
    type MessageTemplate {
      encodedHtml: String!,
      templateId: String!
    }
    input MessageTemplateInput {
      encodedHtml: String!,
      templateId: String!
    }
    type Mutation {
      createMessageTemplate( messageTemplateInput: MessageTemplateInput ): MessageTemplate
      createBulkDelivery( bulkDelieveryInput: BulkDeliveryInput): BulkDeliveryInfo
    }
    type Query {
      getTemplate: MessageTemplate
      userMessages(userId: ID!): [MessageTemplate]
    }

`;

module.exports = types;
