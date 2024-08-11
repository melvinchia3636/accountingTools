const express = require("express");
const fs = require("fs");

const router = express.Router();

router.get("/", (req, res) => {
  const data = fs.readdirSync("./data/books").map((file) => {
    const data = JSON.parse(fs.readFileSync(`./data/books/${file}`, "utf8"));

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

router.get("/:id", (req, res) => {
  if (
    !req.params.id.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    )
  ) {
    return res.status(400).send("Invalid ID");
  }

  const data = JSON.parse(
    fs.readFileSync(`./data/books/${req.params.id}.json`, "utf8")
  );

  res.json({
    status: "success",
    data,
  });
});

router.post("/", (req, res) => {
  const id = require("uuid").v4();
  const { code, name, topic } = req.body;

  fs.writeFileSync(
    `./data/books/${id}.json`,
    JSON.stringify({ code, entityName: name, topic, data: [] }, null, 2)
  );

  res.json({ status: "success", data: id });
});

router.put("/:id", (req, res) => {
  if (
    !req.params.id.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    )
  ) {
    return res.status(400).send("Invalid ID");
  }

  const { code, name, topic } = req.body;

  const book = JSON.parse(
    fs.readFileSync(`./data/books/${req.params.id}.json`, "utf8")
  );

  book.code = code;
  book.entityName = name;
  book.topic = topic;

  fs.writeFileSync(
    `./data/books/${req.params.id}.json`,
    JSON.stringify(book, null, 2)
  );

  res.json({ status: "success" });
});

router.delete("/:id", (req, res) => {
  if (
    !req.params.id.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    )
  ) {
    return res.status(400).send("Invalid ID");
  }

  fs.unlinkSync(`./data/books/${req.params.id}.json`);

  res.json({ status: "success" });
});

router.post("/save/:id", (req, res) => {
  if (
    !req.params.id.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    )
  ) {
    return res.status(400).send("Invalid ID");
  }

  if (!fs.existsSync(`./data/books/${req.params.id}.json`)) {
    return res.status(404).send("Book not found");
  }

  fs.writeFileSync(
    `./data/books/${req.params.id}.json`,
    JSON.stringify(req.body.data, null, 2)
  );

  res.json({ status: "success" });
});

module.exports = router;
