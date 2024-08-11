const fs = require("fs");

fs.readdirSync("../data/books").forEach((file) => {
  const book = JSON.parse(fs.readFileSync(`../data/books/${file}`, "utf8"));

  if (!book.questionName) {
    book.questionName = book.code.match(/[A-Z]$/g)
      ? book.code.slice(0, -1)
      : book.code;
  }

  fs.writeFileSync(`../data/books/${file}`, JSON.stringify(book, null, 2));
});
