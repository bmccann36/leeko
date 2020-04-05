const STS = require('aws-sdk/clients/sts');


module.exports = async function getTempCreds(accessKeyId, secretAccessKey) {

  const sts = new STS({
    accessKeyId,
    secretAccessKey
  });
  const params = {
    RoleArn: "arn:aws:iam::466357709346:role/leeko-dynamo-role",
    RoleSessionName: "leekoAppAssumeRoleSession",
  };
  const stsRes = await sts.assumeRole(params).promise();
  return stsRes.Credentials;

}




