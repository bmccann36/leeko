


module.exports.consumeSqs = async (event) => {

  const records = event.Records;
  console.log("recieved ", records.length, " records")
  console.log(records[0]);

};

