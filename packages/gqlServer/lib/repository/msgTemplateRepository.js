
module.exports = class MsgTemplateRepository {

  constructor(docClient, credentialTool) {
    this.docClientClass = docClient;
    this.tableName = process.env.TABLE_NAME;
    this.credentialTool = credentialTool;
    this.accessCreds = null;
    this.docClient = null;
  }

  init(tempCredentials) {
    console.log("intializing docClient credentials");
    this.docClient = new this.docClientClass({
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

  async putMsgTemplate(item, tempCreds) {

    await this.refreshCredsIfNeeded()

    const params = {
      TableName: this.tableName,
      Item: item,
    };
    return this.docClient.put(params).promise();
  }

}
