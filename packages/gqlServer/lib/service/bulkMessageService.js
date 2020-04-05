const uuid = require('uuidv4').uuid

module.exports = class BulkMessageService {

  constructor(sqsStatic, credentialTool) {
    this.sqsStatic = sqsStatic;
    this.queueUrl = process.env.QUEUE_URL;
    this.credentialTool = credentialTool;
    this.accessCreds = null;
    this.sqsClient = null;
  }

  /**
   * TODO
   * actually deal with credential refreshing/ setting of client instance 
   */
  async init() {
    this.sqsClient = new this.sqsStatic()
  }


  sendToRecipients(input) {
    // break input into batches
    const pendingWrites = [];
    let batchOfTen = [];
    for (let i = 0; i < input.recipientIdList.length; i++) {
      const entry = this.generateSingleSqsMessage(
        input.messageId,
        input.messageTemplateId,
        input.recipientIdList[i]
      );
      batchOfTen.push(entry)
      // check if we won't hit 10 this round
      if (i == input.recipientIdList.length - 1) {
        console.log("generating last batch");
        const params = {
          Entries: batchOfTen,
          QueueUrl: this.queueUrl
        }
        pendingWrites.push(
          this.sqsClient.sendMessageBatch(params).promise()
        )
      }
      // check if we've hit 10
      else if (i % 10 == 0) {
        // console.log("hit divisible by ten");
        const params = {
          Entries: batchOfTen,
          QueueUrl: this.queueUrl
        }
        pendingWrites.push(
          this.sqsClient.sendMessageBatch(params).promise()
        )
        batchOfTen = []; // RESET the container of messages
      }

    }
    return Promise.all(pendingWrites);
  }


  generateSingleSqsMessage(messageId, templateId, recipientId) {
    return {
      Id: uuid(),
      MessageBody: JSON.stringify({
        messageId,
        templateId,
        recipientId
      }),
      MessageAttributes: {
        messageType: {
          DataType: 'String', /* required */
          StringValue: 'msg-recipient-mapping'
        }
      }
    }
  }




}