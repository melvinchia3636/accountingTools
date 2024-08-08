const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/list", (req, res) => {
  const data = fs.readdirSync("./data").map((file) => {
    const data = JSON.parse(fs.readFileSync(`./data/${file}`, "utf8"));

    return {
      id: file.replace(".json", ""),
      code: data.code,
      name: data.entityName,
      topic: data.topic,
      docAmount: {
        journal: data.data.filter((doc) => doc.type === "journal").length,
        ledger: data.data.filter((doc) => doc.type === "ledger").length,
        statement: data.data.filter((doc) => doc.type === "statement").length,
      },
    };
  });

  res.json({
    status: "success",
    data: data.sort((a, b) => a.code.localeCompare(b.code)),
  });
});

app.get("/:id", (req, res) => {
  if (
    !req.params.id.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    )
  ) {
    return res.status(400).send("Invalid ID");
  }

  const data = JSON.parse(
    fs.readFileSync(`./data/${req.params.id}.json`, "utf8")
  );

  res.json({
    status: "success",
    data,
  });
});

app.post("/create/book", (req, res) => {
  const id = require("uuid").v4();
  const { code, name, topic } = req.body;

  fs.writeFileSync(
    `./data/${id}.json`,
    JSON.stringify({ code, entityName: name, topic, data: [] }, null, 2)
  );

  res.json({ status: "success", data: id });
});

app.put("/update/book/:id", (req, res) => {
  if (
    !req.params.id.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    )
  ) {
    return res.status(400).send("Invalid ID");
  }

  const { code, name, topic } = req.body;

  const book = JSON.parse(
    fs.readFileSync(`./data/${req.params.id}.json`, "utf8")
  );

  book.code = code;
  book.entityName = name;
  book.topic = topic;

  fs.writeFileSync(
    `./data/${req.params.id}.json`,
    JSON.stringify(book, null, 2)
  );

  res.json({ status: "success" });
});

app.post("/create/journal/:bookId", (req, res) => {
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
    fs.readFileSync(`./data/${req.params.bookId}.json`, "utf8")
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

  fs.writeFileSync(`./data/${bookId}.json`, JSON.stringify(book, null, 2));

  res.json({ status: "success" });
});

app.post("/create/ledger/:bookId", (req, res) => {
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

app.post("/create/statement/:bookId", (req, res) => {
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
    fs.readFileSync(`./data/${req.params.bookId}.json`, "utf8")
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

  fs.writeFileSync(`./data/${bookId}.json`, JSON.stringify(book, null, 2));

  res.json({ status: "success" });
});

app.delete("/delete/book/:id", (req, res) => {
  if (
    !req.params.id.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    )
  ) {
    return res.status(400).send("Invalid ID");
  }

  fs.unlinkSync(`./data/${req.params.id}.json`);

  res.json({ status: "success" });
});

app.post("/save/:id", (req, res) => {
  if (
    !req.params.id.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    )
  ) {
    return res.status(400).send("Invalid ID");
  }

  if (!fs.existsSync(`./data/${req.params.id}.json`)) {
    return res.status(404).send("Book not found");
  }

  fs.writeFileSync(
    `./data/${req.params.id}.json`,
    JSON.stringify(req.body.data, null, 2)
  );

  res.json({ status: "success" });
});

app.delete("/delete/document/:bookId/:documentID", (req, res) => {
  const { bookId, documentID } = req.params;

  if (
    !bookId.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    )
  ) {
    return res.status(400).send("Invalid book ID");
  }

  const book = JSON.parse(
    fs.readFileSync(`./data/${req.params.bookId}.json`, "utf8")
  );

  book.data = book.data.filter((doc) => doc.id !== parseInt(documentID));

  fs.writeFileSync(`./data/${bookId}.json`, JSON.stringify(book, null, 2));

  res.json({ status: "success" });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
