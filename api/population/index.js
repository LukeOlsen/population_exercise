const { Router } = require("express");
const cache = require("../../cache/index.js");
const saveToFile = require("../../data/index.js");
const router = Router();

router.get("/", (req, res) => {
  return res.json({ message: "welcome to population API" });
});

// ○ State and city should not be case sensitive
// ○ Should return back with a 400 if the state / city combo cant be found with a
// proper error message
// ○ Should return back with a 200 status and json response if found. For example
// {“population”: 32423}

router.get("/state/:state/city/:city", (req, res) => {
  let { state, city } = req.params;

  // valid params
  if (!state || !city) {
    return res.status(400).send("Please provide a state and city");
  }

  // account for case
  state = state.trim().toUpperCase();
  city = city.trim().toUpperCase();
  try {
    if (!cache[state]) {
      return res
        .status(400)
        .send(`Inalid state. No population data could be found for ${state}`);
    } else {
      if (cache[state][city]) {
        // return population
        return res.json({ population: cache[state][city] });
      } else {
        return res
          .status(400)
          .send(`Invalid city. No population data could be found for ${city}`);
      }
    }
  } catch (error) {
    return res.status(400).json({
      error: error,
      message: `Something went wrong fetching population for ${city}, ${state}`,
    });
  }
});

// ○ State and city should not be case sensitive
// ○ Body should be plain text that contains just the number to be set as the
// population
// ○ Should return back with a 400 if data could not be added and proper error
// message
// ○ Should return back a 200 status if the data has updated a state / city that already
// existed and should return back a 201 if the data was created instead of updated.

router.put("/state/:state/city/:city", (req, res) => {
  let { state, city } = req.params;
  let population = req.body;

  // need all params and pop value
  if (!state || !city || !population) {
    return res.status(400).send("Please provide a state, city, and population");
  }
  state = state.trim().toUpperCase();
  city = city.trim().toUpperCase();
  try {
    // I will say this part might be wrong if I am misunderstanding the requirements of the route
    // I'm assuming that states will always be in the cache but cities may not be
    // So if a new city is passed I will add it and save the value down but if a new state is passed I will return an error
    // If that is incorrect this part is not needed
    if (!cache[state]) {
      return res
        .status(400)
        .send(`Inalid state. No population data could be found for ${state}`);
    }
    if (cache[state][city]) {
      // Update existing city and state combination
      cache[state][city] = population;
      saveToFile(cache);
      return res
        .status(200)
        .json({ message: `Population updated for ${city}, ${state}` });
    } else {
      // Add a new city to an already existing state
      cache[state][city] = population;
      saveToFile(cache);
      return res
        .status(201)
        .json({ message: `Population added for ${city}, ${state}` });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: err,
      message: "Something went wrong updating population",
    });
  }
});

module.exports = router;
