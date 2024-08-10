const express = require("express");
const fs = require("fs");

const router = express.Router();

router.post("/:bookId", (req, res) => {
  const { bookId } = req.params;
  const { name, nature, columnCount, topTextColumnCount } = req.body;

  if (
    !bookId.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    )
  ) {
    return res.status(400).send("Invalid book ID");
  }

  if (
    !["A", "A-", "L", "L-", "E", "IN", "IN-", "EX", "EX-", "TEMP"].includes(
      nature
    )
  ) {
    return res.status(400).send("Invalid type");
  }

  if (columnCount < 1) {
    return res.status(400).send("Invalid column count");
  }

  if (topTextColumnCount < 1) {
    return res.status(400).send("Invalid top text column count");
  }

  const book = JSON.parse(
    fs.readFileSync(`./data/${req.params.bookId}.json`, "utf8")
  );

  book.data.push({
    id: book.data[book.data.length - 1]?.id + 1 || 1,
    type: "ledger",
    name,
    nature,
    column: columnCount,
    topTextColumnCount,
    headers: Array(topTextColumnCount).fill({
      debit: Array(columnCount).fill(""),
      credit: Array(columnCount).fill(""),
    }),
    entries: [
      {
        date: "",
        particular: "",
        side: "debit",
        amount: Array(columnCount).fill(0),
      },
      {
        date: "",
        particular: "",
        side: "credit",
        amount: Array(columnCount).fill(0),
      },
    ],
  });

  fs.writeFileSync(`./data/${bookId}.json`, JSON.stringify(book, null, 2));

  res.json({ status: "success" });
});

module.exports = router;
