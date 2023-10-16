// For this project I'm using express
// I believe fastify is faster but I don't have any personal experience with it
// and want to make sure the logic is right before I start trying to optimize
// For most of my speed I'm using caching but this same logic could be applied
// to a fastify server as well

const express = require("express");
const bodyParser = require("body-parser");

// better routing
const api = require("./api/index.js");

// the fastest way to fetch is through caching
const cache = require("./cache/index.js");

const app = express();
const port = 5555;
app.use(bodyParser.text());

const router = express.Router();
app.use(router);
router.use("/api", api);

app.get("/", async (req, res) => {
  console.log(cache);
  return res.json(cache);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
