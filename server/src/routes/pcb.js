const express = require("express");
const fs = require("fs");

const router = express.Router();

router.post("/:bookId", (req, res) => {
  const { bookId } = req.params;
  const { analysisColumnCount, pageNumber } = req.body;

  if (
    !bookId.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    )
  ) {
    return res.status(400).send("Invalid book ID");
  }

  if (analysisColumnCount < 1) {
    return res.status(400).send("Invalid analysis column count");
  }

  const book = JSON.parse(
    fs.readFileSync(`./data/books/${req.params.bookId}.json`, "utf8")
  );

  book.data.push({
    id: book.data[book.data.length - 1]?.id + 1 || 1,
    type: "petty-cash-book",
    pageNumber,
    analysisColumnCount,
    headers: Array(analysisColumnCount).fill(""),
    name: "Petty Cash Book",
    entries: [
      {
        receipts: 0,
        folio: "",
        date: "",
        particular: "",
        voucher: "",
        payments: 0,
        analysis: Array(analysisColumnCount).fill(0),
        analysisIsText: Array(analysisColumnCount).fill(false),
        ledgerAccounts: 0,
        ledgerFolio: "",
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
