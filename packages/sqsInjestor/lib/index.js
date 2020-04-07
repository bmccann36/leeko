
const batchWrite = require('awsutils').batchWrite;

module.exports.consumeSqs = async (event) => {

  const items = event.Records.map(record => {
    return JSON.parse(record.body);
  })
  const res = await batchWrite("LeekoMessageMapping", items)
  console.log('res :', res);

};

