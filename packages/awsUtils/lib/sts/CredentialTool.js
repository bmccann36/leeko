const STS = require('aws-sdk/clients/sts');


module.exports = class CredentialTool {

  constructor() {
    this.accessCreds = null;
    this.sts = new STS({
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
    });

  }

  async getTempCreds() {
    if (this.accessCreds) {
      // this is fine because this class makes sure credentials are always up to date
      return this.accessCreds;
    }
    console.log("access credentials not present, doing initial fetch");
    const params = {
      RoleArn: "arn:aws:iam::466357709346:role/leeko-dynamo-role",
      RoleSessionName: "leekoAppAssumeRoleSession",
    };
    const stsRes = await this.sts.assumeRole(params).promise();
    this.accessCreds = stsRes.Credentials
    this.beginTimer()
    return this.accessCreds;
  }

  async beginTimer() {
    const credsExpirDateStr = this.accessCreds.Expiration;
    const credsExpirTs = new Date(credsExpirDateStr).getTime()
    let currTs = new Date().getTime();
    const milliTillExpir = credsExpirTs - currTs
    console.log("millisec till expir: ", milliTillExpir)
    const timeToWaitBeforeRefresh = milliTillExpir - 600000;
    setInterval(() => {
      console.log('creds expir time is approaching, refreshing credentials');
      this.refreshCreds()
    }, timeToWaitBeforeRefresh);
  }

  async refreshCreds() {
    const params = {
      RoleArn: "arn:aws:iam::466357709346:role/leeko-dynamo-role",
      RoleSessionName: "leekoAppAssumeRoleSession",
    };
    const stsRes = await this.sts.assumeRole(params).promise();
    console.log("acess creds refreshed, setting creds on helper singleton class")
    this.accessCreds = stsRes.Credentials
  }


}




