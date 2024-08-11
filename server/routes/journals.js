const express = require("express");
const fs = require("fs");

const router = express.Router();

router.post("/:bookId", (req, res) => {
  const { bookId } = req.params;
  const { name } = req.body;

  if (
    !bookId.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    )
  ) {
    return res.status(400).send("Invalid book ID");
  }

  const book = JSON.parse(
    fs.readFileSync(`./data/books/${req.params.bookId}.json`, "utf8")
  );

  book.data.push({
    id: book.data[book.data.length - 1]?.id + 1 || 1,
    type: "journal",
    name,
    entries: [
      {
        isNew: true,
        date: "",
        particular: "",
        debit: 0,
        credit: 0,
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
