

const { request } = require('graphql-request')
const makeShortId = require('utils').makeShortId;

// ! constants
const GQL_URL = 'http://leeko-gql-route-brian.apps.openshift.cedruscloud.com/graphql'
const NUM_LOOPS = 20;
const IDS_PER_BATCH = 500;
const TMPLT_IDS = ["tmplt01", "tmplt02", "tmplt03", "tmplt04", "tmplt05"]

const pendingWork = [];

// for loop 
for (let i = 0; i < NUM_LOOPS; i++) {
  const tmpltIdx = i % 5;
  const templateId = TMPLT_IDS[tmpltIdx];
  const idList = [];
  for (let i = 0; i < IDS_PER_BATCH; i++) {
    idList.push(makeShortId(10))
  }
  const messageId = makeShortId(10);
  pendingWork.push(sendBulkReq(templateId, idList, messageId));
}
Promise.all(pendingWork).then(res => {
  console.log('res :', res);
})



function sendBulkReq(messageTemplateId, recipientIdList, messageId) {
  const mutation = `mutation {
    createBulkDelivery(
      bulkDelieveryInput: {
        messageTemplateId: "${messageTemplateId}"
        recipientIdList: ${JSON.stringify(recipientIdList)}
        messageId: "${messageId}"
      }
    ) {
      messageTemplateId
    }
  }`
  return request(GQL_URL, mutation);
}


