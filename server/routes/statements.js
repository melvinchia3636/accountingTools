const express = require("express");
const fs = require("fs");

const router = express.Router();

router.post("/:bookId", (req, res) => {
  const { bookId } = req.params;
  const { name, subtitle, columnCount, topTextColumnCount } = req.body;

  if (
    !bookId.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    )
  ) {
    return res.status(400).send("Invalid book ID");
  }

  if (columnCount < 1) {
    return res.status(400).send("Invalid column count");
  }

  if (topTextColumnCount < 1) {
    return res.status(400).send("Invalid top text column count");
  }

  const book = JSON.parse(
    fs.readFileSync(`./data/books/${req.params.bookId}.json`, "utf8")
  );

  book.data.push({
    id: book.data[book.data.length - 1]?.id + 1 || 1,
    type: "statement",
    name,
    subtitle,
    columnCount,
    topTextColumnCount,
    headers: Array(topTextColumnCount).fill(Array(columnCount).fill("")),
    entries: [
      {
        particular: "",
        amount: Array(columnCount).fill(0),
      },
    ],
  });

  fs.writeFileSync(
    `./data/books/${bookId}.json`,
    JSON.stringify(book, null, 2)
  );

  res.json({ status: "success" });
});

module.exports = router;
