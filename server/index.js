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
    };
  });

  res.json({
    status: "success",
    data,
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
  const { name, nature } = req.body;

  if (
    !bookId.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    )
  ) {
    return res.status(400).send("Invalid book ID");
  }

  if (!["A", "L", "E", "INC", "EXP"].includes(nature)) {
    return res.status(400).send("Invalid type");
  }

  const book = JSON.parse(
    fs.readFileSync(`./data/${req.params.bookId}.json`, "utf8")
  );

  book.data.push({
    id: book.data[book.data.length - 1]?.id + 1 || 1,
    type: "ledger",
    name,
    nature,
    entries: [
      {
        date: "",
        particular: "",
        side: "debit",
        amount: 0,
      },
      {
        date: "",
        particular: "",
        side: "credit",
        amount: 0,
      },
    ],
  });

  fs.writeFileSync(`./data/${bookId}.json`, JSON.stringify(book, null, 2));

  res.json({ status: "success" });
});

app.post("/create/statement/:bookId", (req, res) => {
  const { bookId } = req.params;
  const { name, subtitle, columnCount } = req.body;

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
    type: "statement",
    name,
    subtitle,
    columnCount,
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

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
