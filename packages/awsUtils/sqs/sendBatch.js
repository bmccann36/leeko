const SQS = require('aws-sdk/clients/sqs');
const uuid = require('uuidv4').uuid;

const sqs = new SQS();

const params = {
  Entries: [
    {
      Id: uuid(),
      MessageBody: 'msgBody',
    },
    {
      Id: uuid(),
      MessageBody: 'msgBody',
    },

  ],
  QueueUrl: 'https://sqs.us-east-1.amazonaws.com/466357709346/leeko-queue-dev',
};
sqs.sendMessageBatch(params).promise()
  .then(res => {
    console.log('res :', res);
  });
