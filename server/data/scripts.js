const fs = require("fs");

fs.readdirSync("./books").forEach((file) => {
  const book = JSON.parse(fs.readFileSync(`./books/${file}`, "utf8"));

  book.data.forEach((doc) => {
    if (doc.type === "ledger") {
      doc.isInGL = true;
    }
  });

  fs.writeFileSync(`./books/${file}`, JSON.stringify(book, null, 2));
});
