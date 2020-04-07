const DynamoDB = require('aws-sdk/clients/dynamodb');
const docClient = new DynamoDB.DocumentClient();
/**
 *
 * @param {array} itemArray items to write to db
 * writes to dynamo in batches of 25 and returns when done
 */
module.exports = function (tableName, itemArray) {
  const pendingWrites = [];
  for (let i = 0; i < itemArray.length; i = i + 25) {
    // construct a delete 25 item promise
    const slicedBatch = itemArray.slice(i, i + 25);

    // construct write params

    const formatted = (formatBatch(tableName, slicedBatch));
    const pendingBatch = docClient.batchWrite(formatted).promise();
    pendingWrites.push(pendingBatch);
  }
  return Promise.all(pendingWrites);
};

function formatBatch(tableName, batch) {
  const batchOfPuts = batch.map(item => {
    return {
      PutRequest: {
        Item: item,
      },
    };
  });
  return {
    RequestItems: {
      [tableName]: batchOfPuts,
    },
  };
}
