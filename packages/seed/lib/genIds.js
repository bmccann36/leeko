const fs = require('fs');
const uuid = require('uuidv4').uuid;

const userIds = [];
for (let i = 0; i < 100000; i++) {
  userIds.push(uuid())
}


let data = JSON.stringify(userIds);
fs.writeFileSync('userIds.json', data);