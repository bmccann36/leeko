require('dotenv').config();
const BulkMessageService = require('./bulkMessageService');
const makeShortId = require('utils').makeShortId
const SQS = require('aws-sdk/clients/sqs');

describe("#bulkMessageService", () => {

  const bulkSvc = new BulkMessageService(SQS, () => { })


  it("loops over the ids", async () => {

    await bulkSvc.init()
    const input = {
      messageTemplateId: 'template01',
      recipientIdList: makeIdListOf(100),
      messageId: 'msg01'
    }

    bulkSvc.sendToRecipients(input)

  })

})


function makeIdListOf(len) {
  const idList = [];
  for (let i = 0; i < len; i++) {
    idList.push(makeShortId(5))
  }
  return idList;
}