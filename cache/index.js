// Not sure if I'm coloring outside the lines but I think the fastest way to solve this problem is through a cache
// Not just a cache but a better data structure to make lookups as close to O(1) as possible
// By looping through and storing all values in a map we should return errors and values in O(1) time

// Again, not sure if I was meant to treat this as more of DB problem but this is how I would approach this in real life

// Also in real life I would use something like redis rather than storing everything in memory but that is neither here nor there

const csv = require("csvtojson");
const { readFile } = require("node:fs/promises");

const populationCsvFile = __dirname + "/../data/city_populations.csv";
const populationJsonFile = __dirname + "/../data/populationSave.json";

let cache = {};

const loadCsvFile = async () => {
  const csvArray = await csv().fromFile(populationCsvFile);

  return csvArray;
};

const loadJsonFile = async () => {
  try {
    const data = await readFile(populationJsonFile, "utf8");
    obj = JSON.parse(data);
    return obj;
  } catch (err) {
    return null;
  }
};

// Try to load a saved JSON file first (this is if the API has modified data)
// A fresh start will always load the provided CSV file
Promise.resolve(loadJsonFile()).then((value) => {
  if (value) {
    for (key in value) {
      cache[key] = value[key];
    }
    console.log("Cache loaded");
    return;
  } else {
    Promise.resolve(loadCsvFile()).then((c) => {
      c.forEach((x) => {
        const state = x.state.toUpperCase();
        const city = x.city.toUpperCase();
        if (cache[state] === undefined) {
          cache[state] = {};
        } else {
          if (cache[state][city] === undefined) {
            cache[state][city] = x.population;
          } else {
            cache[state][city] += x.population;
          }
        }
      });
      console.log("Cache loaded");
      return;
    });
  }
});

module.exports = cache;
