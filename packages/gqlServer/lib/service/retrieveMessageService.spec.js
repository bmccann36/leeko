require('dotenv').config();
const RetrieveMessageService = require('./retrieveMessageService');
const DocClient = require('aws-sdk/clients/dynamodb').DocumentClient;

describe("#bulkMessageService", () => {

  const target = new RetrieveMessageService(new DocClient())


  it("gets all unread messages for a user", async () => {
    const res = await target.getMessages("0qhOaKH3oP")
    console.log(res);
    

  })

})


