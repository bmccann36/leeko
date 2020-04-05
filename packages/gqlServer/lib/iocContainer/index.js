
require('dotenv').config();
var inversify = require("inversify");
var helpers = require("inversify-vanillajs-helpers").helpers;
require("reflect-metadata");
const DynamoDB = require('aws-sdk/clients/dynamodb')
const SQS = require('aws-sdk/clients/sqs');

// my libs
const MsgTemplateRepository = require('../repository/msgTemplateRepository')
const CredentialTool = require('awsutils').CredentialTool;
const BulkMessageService = require('../service/bulkMessageService')

const TYPES = {
  MSG_TEMPLATE_REPOSITORY: 'MSG_TEMPLATE_REPOSITORY',
  DOC_CLIENT: 'DOC_CLIENT',
  SQS_STATIC: 'SQS_STATIC',
  CREDENTIAL_TOOL: 'CREDENTIAL_TOOL',
  BULK_MESSAGE_SERVCIE: 'BULK_MESSAGE_SERVICE'
}


// Declare bindings
var container = new inversify.Container();
var register = helpers.register(container);
// DYNAMO DB (static class / not instantiated)
var registerDynamoClass = helpers.registerConstantValue(container);
registerDynamoClass(TYPES.DOC_CLIENT, DynamoDB.DocumentClient);
// SQS (static class / not instantiated)
const registerSqsClass = helpers.registerConstantValue(container);
registerSqsClass(TYPES.SQS_STATIC, SQS)
// CREDENTIAL TOOL
const registerCredentialTool = helpers.registerConstantValue(container);
registerCredentialTool(TYPES.CREDENTIAL_TOOL, new CredentialTool());
// REPOSITORY (for message templates)
register(
  TYPES.MSG_TEMPLATE_REPOSITORY, // tag it
  [TYPES.DOC_CLIENT, TYPES.CREDENTIAL_TOOL]) // specify deps in order
  (MsgTemplateRepository) // pass the class to the returned function
// SQS BULK MSG SERVICE
register(
  TYPES.BULK_MESSAGE_SERVCIE,
  [TYPES.SQS_STATIC, TYPES.CREDENTIAL_TOOL])
  (BulkMessageService)


module.exports = { container, TYPES };

