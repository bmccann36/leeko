const uuid = require('uuidv4').uuid

module.exports = class BulkMessageService {

  constructor(sqsStatic, credentialTool) {
    this.sqsStatic = sqsStatic;
    this.queueUrl = process.env.QUEUE_URL;
    this.credentialTool = credentialTool;
    this.accessCreds = null;
    this.sqsClient = null;
  }


  async init(tempCredentials) {
    console.log("initializing creds for sqs")
    this.sqsClient = new this.sqsStatic({
      accessKeyId: tempCredentials.AccessKeyId,
      secretAccessKey: tempCredentials.SecretAccessKey,
      sessionToken: tempCredentials.SessionToken
    })
    this.accessCreds = tempCredentials;
  }


  async sendToRecipients(input) {
    // make sure creds are up to date
    await this.refreshCredsIfNeeded();
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

  async refreshCredsIfNeeded() {
    const credsExpirDateStr = this.accessCreds.Expiration;
    const credsExpirTs = new Date(credsExpirDateStr).getTime()
    let currTs = new Date().getTime();

    console.log("millisec till expir: ", credsExpirTs - currTs)

    if (credsExpirTs - currTs < 2000) {
      console.log("getting new creds synchronously from creds helper")
      // happens sychronously but have to use await since the fn signature returns a promise
      const tempCredentials = await this.credentialTool.getTempCreds();
      this.init(tempCredentials);
    }
  }



}