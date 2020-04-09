

module.exports = class RetrieveMessageService {

  constructor(staticDocClient, credentialTool) {
    this.staticDocClient = staticDocClient;
    this.docClient = null;
    this.credentialTool = credentialTool;
    this.accessCreds = null;
    this.templateTable = process.env.TEMPLATE_TABLE_NAME;
    this.mappingTable = process.env.MSG_MAP_TABLE_NAME;
  }

  init(tempCredentials) {
    this.docClient = new this.staticDocClient({
      accessKeyId: tempCredentials.AccessKeyId,
      secretAccessKey: tempCredentials.SecretAccessKey,
      sessionToken: tempCredentials.SessionToken
    })
    this.accessCreds = tempCredentials;
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