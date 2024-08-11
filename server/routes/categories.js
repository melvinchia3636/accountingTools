const express = require("express");
const fs = require("fs");

const router = express.Router();

router.get("/", (req, res) => {
  const categories = JSON.parse(
    fs.readFileSync("./data/books/categories.json", "utf8")
  );

  res.json(categories);
});

module.exports = router;
