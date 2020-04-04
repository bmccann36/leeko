
require('dotenv').config();
var inversify = require("inversify");
var helpers = require("inversify-vanillajs-helpers").helpers;
require("reflect-metadata");
const DynamoDB = require('aws-sdk/clients/dynamodb')

const MsgTemplateRepository = require('../repository/msgTemplateRepository')

const TYPES = {
  MSG_TEMPLATE_REPOSITORY: 'MSG_TEMPLATE_REPOSITORY',
  DOC_CLIENT: 'DOC_CLIENT'
}


// Declare bindings
var container = new inversify.Container();
var register = helpers.register(container);
// DYNAMO DB
var registerConstantValue = helpers.registerConstantValue(container);
registerConstantValue(TYPES.DOC_CLIENT, new DynamoDB.DocumentClient());
// REPOSITORY
register(
  TYPES.MSG_TEMPLATE_REPOSITORY, // tag it
  [TYPES.DOC_CLIENT]) // specify deps in order
  (MsgTemplateRepository) // pass the class to the returned function


module.exports = { container, TYPES };

// const repo = container.get(TYPES.MSG_TEMPLATE_REPOSITORY);
// repo.putMsgTemplate({
//   encodedHtml: "some html",
//   templateId: "template01"
// }).then(res => {
//   console.log(res);
// })