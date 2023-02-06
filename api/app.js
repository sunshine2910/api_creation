/**
 * Express App
 */
const express = require("express");
const app = express();

// middleware
app.use(express.json());

app.response.render = function (users) {
  this.format({
    "application/json": () => this.json(users),
    "text/plain": () => {
      this.setHeader("Content-Type", "text/plain");
      if (!Array.isArray(users)) users = [users];
      this.send(users.map((u) => JSON.stringify(u)).join("\n"));
    },
    "text/csv": () => {
      this.setHeader("Content-Type", "text/csv");
      if (!Array.isArray(users)) users = [users];
      this.write(Object.keys(users[0].dataValues).join(";") + "\n");
      this.write(
        users.map((u) => Object.values(u.dataValues).join(";")).join("\n")
      );
      this.end();
    },
    default: () => this.json(users),
  });
};

// Routes
app.use("/users", require("./routes/users"));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
