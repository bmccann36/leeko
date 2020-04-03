'use strict';

const sqsInjestor = require('../lib/index').consumeSqs;
const fs = require('fs');
const path = require('path');
const mockInPath = path.join(__dirname, '..', 'mocks/sqsInput.json');

const mockSqsFile = fs.readFileSync(mockInPath);
const mockSqsInput = JSON.parse(mockSqsFile);


describe('#sqsInjestor', () => {
  it('consumeSqs entrypoint', () => {
    // console.log(mockSqsInput);
    sqsInjestor(mockSqsInput)
  });
});
