/**
 * Express App
 */
const express = require("express");
const { defaults } = require("pg");
const app = express();

// middleware
app.use(
  express.json(),
  negociate_format({
    formats: ["application/json", "text/csv"],
  })
);

function negociate_format({ formats }) {
  return function (req, res, next) {
    res.render = function (data) {
      const func = {
        "application/json": () => {
          res.json(data);
        },
        "text/plain": () => {
          res.setHeader("Content-Type", "text/plain");
          if (!Array.isArray(data)) data = [data];
          res.send(data.map((u) => JSON.stringify(u)).join("\n"));
        },
        "text/csv": () => {
          res.setHeader("Content-Type", "text/csv");
          if (!Array.isArray(data)) data = [data];
          res.write(Object.keys(data[0].dataValues).join(";") + "\n");
          res.write(
            data.map((u) => Object.values(u.dataValues).join(";")).join("\n")
          );
          res.end();
        },
      };
      const initialValue = {};
      const sumWithInitial = formats.reduce((accumulator, currentValue) => {
        accumulator[currentValue] = func[currentValue];
        return accumulator;
      }, initialValue);
      sumWithInitial.default = function () {
        // log the request and respond with 406
        res.status(406).send('Not Acceptable')
      }
      res.format(sumWithInitial);
    }
    next();
  };
}

// Routes
app.use("/users", require("./routes/users"));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
