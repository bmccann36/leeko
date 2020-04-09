

module.exports = class RetrieveMessageService {

  constructor(docClient) {
    this.docClient = docClient;
    this.templateTable = process.env.TEMPLATE_TABLE_NAME;
    this.mappingTable = process.env.MSG_MAP_TABLE_NAME;
  }

  async getMessages(userId) {
    const dynamoRes = await this.getUnreadMsgMappings(userId);
    if (dynamoRes.Count == 0) { return [] }
    const responseMap = this.mapDynamoResToResponseMap(dynamoRes)
    const dynamoTemplatesRes = await this.getMessageTemplates(dynamoRes)
    return this.combineMapingWithTemplates(dynamoTemplatesRes, responseMap)
  }

  combineMapingWithTemplates(dynamoTemplatesRes, responseMap){
    const listOfTemplates = dynamoTemplatesRes.Responses.LeekoMessageTemplate;

    listOfTemplates.forEach(template => {
      const templId = template.templateId;
      responseMap[templId] = template;
    })
    return Object.keys(responseMap).map(key => {
      return responseMap[key]
    })
  }

  getMessageTemplates(dynamoRes){
    const templateIdKeys = dynamoRes.Items.map(msg => {
      return { templateId: msg.templateId };
    })
    const batchGetParams = {
      RequestItems: {
        [this.templateTable]: {
          Keys: templateIdKeys
        }
      }
    }
    return this.docClient.batchGet(batchGetParams).promise()
  }

  mapDynamoResToResponseMap(dynamoRes) {
    let responseMap = {}
    dynamoRes.Items.forEach(item => {
      responseMap[item.templateId] = {}
    })
    return responseMap;
  }

  getUnreadMsgMappings(userId) {
    const params = {
      TableName: this.mappingTable,
      KeyConditionExpression: 'recipientId = :recipientId',
      ExpressionAttributeValues: {
        ':recipientId': userId,
      },
      FilterExpression: "attribute_not_exists(msgRead)"
    }
    return this.docClient.query(params).promise()
  }
}