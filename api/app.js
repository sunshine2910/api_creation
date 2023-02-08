/**
 * Express App
 */
const express = require("express");
const i18next  = require("./lib/i18n");
const { defaults } = require("pg");
const app = express();

// middleware
app.use(
  negociate_translation(i18next),
  express.json(),
  negociate_format({
    formats: ["application/json", "text/csv"],
  }),
  function (req, res, next) {
    if (req.headers["accept-version"]) {
      req.api_version = req.headers["accept-version"];
    } else if (req.query["_apiVersion"]) {
      req.api_version = req.query["_apiVersion"];
    } else {
      req.api_version = "v1";
    }
  next();
  }
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
//app.use(
//  "/users",
//  apiVersions({
//    v1: require("./routes/v1/users"),
//    v2: require("./routes/v2/users"),
//  })
//);
app.use("/v1/users", require("./routes/v1/users"));
app.use("/v2/users", require("./routes/v2/users"));




function negociate_translation(i18next){
  return async function (req, res, next) {
  i18next.changeLanguage(req.headers["accept-language"]);
  req.t = i18next.t
  next();
}
};


module.exports = app;