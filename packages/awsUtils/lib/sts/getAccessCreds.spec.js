const CredentialTool = require('./getAccessCreds');

describe("#getAccessCreds", () => {
  const credTool = new CredentialTool();

  it("works on timer", () => {
    setTimeout(function () {
      console.log('timeout completed');
    }, 100000000);
    const creds = credTool.getTempCreds()


  })
})