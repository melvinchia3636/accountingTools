const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const booksRoute = require("./routes/books");
const journalRoute = require("./routes/journals");
const ledgerRoute = require("./routes/ledgers");
const statementRoute = require("./routes/statements");
const categoriesRoute = require("./routes/categories");
const autofillRoute = require("./routes/autofill");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/books", booksRoute);
app.use("/journals", journalRoute);
app.use("/ledgers", ledgerRoute);
app.use("/statements", statementRoute);
app.use("/categories", categoriesRoute);
app.use("/autofill", autofillRoute);

app.delete("/documents/:bookId/:documentID", (req, res) => {
  const { bookId, documentID } = req.params;

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

  book.data = book.data.filter((doc) => doc.id !== parseInt(documentID));

  fs.writeFileSync(
    `./data/books/${bookId}.json`,
    JSON.stringify(book, null, 2)
  );

  res.json({ status: "success" });
});

app.get("/questions/:bookId", (req, res) => {
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

  const questionName = book.questionName;

  if (fs.existsSync(`./media/${questionName}.pdf`)) {
    return res.sendFile(path.resolve(`./media/${questionName}.pdf`));
  }

  res.status(404).send("File not found");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
