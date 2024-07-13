const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/list", (req, res) => {
  const data = require("fs")
    .readdirSync("./data")
    .map((file) => {
      const data = JSON.parse(
        require("fs").readFileSync(`./data/${file}`, "utf8")
      );

      return {
        id: file.replace(".json", ""),
        name: data.entityName,
        topic: data.topic,
      };
    });

  res.json(data);
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
    require("fs").readFileSync(`./data/${req.params.id}.json`, "utf8")
  );

  res.json(data);
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
