
module.exports = class MsgTemplateRepository {

  constructor(docClient, credentialTool) {
    this.docClientClass = docClient;
    this.tableName = process.env.TABLE_NAME;
    this.credentialTool = credentialTool;
    this.accessCreds = null;
    this.docClient = null;
  }

  async init() {
    console.log("intializing docClient credentials");
    const creds = await this.credentialTool(
      process.env.ACCESS_KEY,
      process.env.SECRET_KEY,
    );
    this.accessCreds = creds;
    this.docClient = new this.docClientClass({
      accessKeyId: creds.AccessKeyId,
      secretAccessKey: creds.SecretAccessKey,
      sessionToken: creds.SessionToken
    })
  }

  async refreshCredsIfNeeded() {
    const credsExpirDateStr = this.accessCreds.Expiration;
    const credsExpirTs = new Date(credsExpirDateStr).getTime()
    let currTs = new Date().getTime();

    console.log("millisec till expir: ", credsExpirTs - currTs)

    if (credsExpirTs - currTs < 2000) {
      console.log("request will block till new token is recieved")
      await this.init() // await statement purposefully blocks 
    }
    else if (credsExpirTs - currTs < 200000) {
      console.log("token will expire soon will fetch a new one but allow request");
      this.init() // no await, so it won't block
    }

  }

  async putMsgTemplate(item) {

    await   this.refreshCredsIfNeeded()

    const params = {
      TableName: this.tableName,
      Item: item,
    };
    return this.docClient.put(params).promise();
  }

}
