
module.exports = class MsgTemplateRepository {

  constructor(docClient) {
    this.docClient = docClient;
    this.tableName = process.env.TABLE_NAME;
  }

  putMsgTemplate(item) {
    const params = {
      TableName: this.tableName,
      Item: item,
    };
    return this.docClient.put(params).promise();
  }

}
