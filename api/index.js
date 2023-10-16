const { Router } = require("express");
const population = require("./population/index.js");

const router = Router();
router.use("/population", population);

router.get("/", (req, res) => {
  res.send("Hello World from the API root!");
});

module.exports = router;
