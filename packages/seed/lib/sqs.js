const SQS = require('aws-sdk/clients/sqs');
const uuid = require('uuidv4').uuid;
var faker = require('faker');
const sqs = new SQS();
const getRandomInt = require('utils').getRandomInt


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


function generateEntry() {
  return {
    Id: uuid(),
    MessageBody: {
      messageId: getRandomInt(1, 10),
      recipientId: uuid()
    },

    MessageAttributes: {
      messageType: {
        DataType: 'String', /* required */
        StringValue: 'msg-recipient-mapping'
      }
    }
  }
}
