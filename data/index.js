const fs = require("fs");

// I might be misinterpreting the requirements for this one but one of the higher requirements is that the data persist
// If this function is not added the data will persist in memory but not in the file system
// If we need to persist outside of server memory I'm just writing the updated cache to a json file and will read it in on server start
// Ideally this will be a DB of some kind but I'm not sure if that is outside the scope of the assignment
// Also, not necessarily optimized but just writing to a new file on every update is the easiest way to make sure the data persists

const saveToFile = (data) => {
  fs.writeFile(
    __dirname + "/populationSave.json",
    JSON.stringify(data),
    "utf8",
    function (err) {
      console.log(err);
      console.log("File saved");
    }
  );
};

module.exports = saveToFile;
