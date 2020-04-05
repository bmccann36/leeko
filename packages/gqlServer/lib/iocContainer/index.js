
require('dotenv').config();
var inversify = require("inversify");
var helpers = require("inversify-vanillajs-helpers").helpers;
require("reflect-metadata");
const DynamoDB = require('aws-sdk/clients/dynamodb')

// my libs
const MsgTemplateRepository = require('../repository/msgTemplateRepository')
const credentialTool = require('awsutils').getAccessCreds;

const TYPES = {
  MSG_TEMPLATE_REPOSITORY: 'MSG_TEMPLATE_REPOSITORY',
  DOC_CLIENT: 'DOC_CLIENT',
  CREDENTIAL_TOOL: 'CREDENTIAL_TOOL'
}


// Declare bindings
var container = new inversify.Container();
var register = helpers.register(container);
// DYNAMO DB
var registerDynamoClass = helpers.registerConstantValue(container);
registerDynamoClass(TYPES.DOC_CLIENT, DynamoDB.DocumentClient);
// CREDENTIAL TOOL
const registerCredentialTool = helpers.registerConstantValue(container);
registerCredentialTool(TYPES.CREDENTIAL_TOOL, credentialTool);
// REPOSITORY
register(
  TYPES.MSG_TEMPLATE_REPOSITORY, // tag it
  [TYPES.DOC_CLIENT, TYPES.CREDENTIAL_TOOL]) // specify deps in order
  (MsgTemplateRepository) // pass the class to the returned function


module.exports = { container, TYPES };

