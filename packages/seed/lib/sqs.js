const SQS = require('aws-sdk/clients/sqs');
const uuid = require('uuidv4').uuid;
var faker = require('faker');
const sqs = new SQS();


(async () => {
  const numEntries = process.argv[2];
  // const url = process.argv[3];
  if (!numEntries) {
    throw Error("you must pass a number of messages to seed")
  }
  //  if (!url) {
  //   throw Error("must pass queue url")
  // }
  const pendingWrites = [];
  let batchOfTen = [];
  for (let i = 1; i <= numEntries; i++) {
    const entry = generateEntry();
    batchOfTen.push(entry)

    if (i % 10 == 0) {
      console.log("hit divisible by ten");
      const params = {
        Entries: batchOfTen,
        QueueUrl: 'https://sqs.us-east-1.amazonaws.com/466357709346/leeko-queue-dev'
      }
      pendingWrites.push(
        sqs.sendMessageBatch(params).promise()
      )
      batchOfTen = [];
    }

  }

})();

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
// sqs.sendMessageBatch(params).promise()
//   .then(res => {
//     console.log('res :', res);
//   });

function generateEntry() {
  return {
    Id: uuid(),
    MessageBody: faker.lorem.paragraph()
  }
}
