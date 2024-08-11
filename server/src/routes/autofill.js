const express = require("express");
const fs = require("fs");

const router = express.Router();

router.get("/book-topics", (req, res) => {
  const data = fs.readdirSync("./data/books").map((file) => {
    const data = JSON.parse(fs.readFileSync(`./data/books/${file}`, "utf8"));
    return data.topic;
  });

  res.json({
    status: "success",
    data: [...new Set(data)].sort((a, b) => a.localeCompare(b)),
  });
});

router.get("/ledger-names/:bookId", (req, res) => {
  const { bookId } = req.params;

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

  const topic = book.topic;

  const allBooks = fs
    .readdirSync("./data/books")
    .map((file) => {
      const data = JSON.parse(fs.readFileSync(`./data/books/${file}`, "utf8"));
      return data;
    })
    .filter((book) => book.topic === topic);

  const data = allBooks
    .flatMap((book) => book.data)
    .filter((doc) => doc.type === "ledger")
    .map((doc) => doc.name);

  res.json({
    status: "success",
    data: [...new Set(data)].sort((a, b) => a.localeCompare(b)),
  });
});

router.get("/statement-names/:bookId", (req, res) => {
  const { bookId } = req.params;

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

  const topic = book.topic;

  const allBooks = fs
    .readdirSync("./data/books")
    .map((file) => {
      const data = JSON.parse(fs.readFileSync(`./data/books/${file}`, "utf8"));
      return data;
    })
    .filter((book) => book.topic === topic);

  const data = allBooks
    .flatMap((book) => book.data)
    .filter((doc) => doc.type === "statement")
    .map((doc) => doc.name);

  res.json({
    status: "success",
    data: [...new Set(data)].sort((a, b) => a.localeCompare(b)),
  });
});

router.get("/statement-particulars/:bookId/:docName", (req, res) => {
  const { bookId } = req.params;

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

  const docName = decodeURIComponent(req.params.docName);

  const allBooks = fs.readdirSync("./data/books").map((file) => {
    const data = JSON.parse(fs.readFileSync(`./data/books/${file}`, "utf8"));
    return data;
  });

  const data = allBooks
    .filter(
      (b) => b.topic === book.topic && b.data.some((d) => d.name === docName)
    )
    .flatMap((book) => book.data)
    .filter((doc) => doc.type === "statement" && doc.name === docName)
    .flatMap((doc) => doc.entries)
    .flatMap((entry) => entry.particular)
    .map((e) => e.replace(/\(.*\)|\[.*\]/g, "").trim())
    .filter((e) => e);

  res.json({
    status: "success",
    data: [...new Set(data)].sort((a, b) => a.localeCompare(b)),
  });
});

router.get("/ledger-particulars/:bookId/", (req, res) => {
  const { bookId } = req.params;

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

  const allBooks = fs.readdirSync("./data/books").map((file) => {
    const data = JSON.parse(fs.readFileSync(`./data/books/${file}`, "utf8"));
    return data;
  });

  const data = allBooks
    .filter((b) => b.topic === book.topic)
    .flatMap((book) => book.data)
    .filter((doc) => doc.type === "ledger")
    .flatMap((doc) => doc.entries)
    .flatMap((entry) => entry.particular)
    .map((e) => e.replace(/\(.*\)|\[.*\]/g, "").trim())
    .filter((e) => e && e !== "TOTAL");

  res.json({
    status: "success",
    data: [...new Set(data)].sort((a, b) => a.localeCompare(b)),
  });
});

module.exports = router;
