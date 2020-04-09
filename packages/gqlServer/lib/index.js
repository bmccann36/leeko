require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./types');
const resolvers = require('./resolvers');
const { container, TYPES } = require('./iocContainer');

const credentialTool = container.get(TYPES.CREDENTIAL_TOOL);

credentialTool.getTempCreds()
  .then((awsCredentials) => {

    const msgTemplateRepository = container.get(TYPES.MSG_TEMPLATE_REPOSITORY)
    const bulkMessageService = container.get(TYPES.BULK_MESSAGE_SERVCIE)
    const retrieveMessageService = container.get(TYPES.RETRIEVE_MESSAGE_SERVICE)
    msgTemplateRepository.init(awsCredentials)
    bulkMessageService.init(awsCredentials)
    retrieveMessageService.init(awsCredentials);

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: {
        msgTemplateRepository,
        bulkMessageService,
        retrieveMessageService,
      }
    });

    server
      .listen()
      .then(({ url }) => console.log(`Server is running on ${process.env.HOST_NAME}:4000`));

  })


