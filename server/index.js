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

app.post("/create", (req, res) => {
  const id = require("uuid").v4();
  const { code, name, topic } = req.body;

  fs.writeFileSync(
    `./data/${id}.json`,
    JSON.stringify({ code, entityName: name, topic, data: [] }, null, 2)
  );

  res.json({ status: "success", data: id });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
