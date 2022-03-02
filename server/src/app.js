const express = require("express");
const morgan = require("morgan");
const request = require("request");
const cors = require("cors");
const chalk = require("chalk");
const zlib = require("zlib");
const sharp = require("sharp");

// Set env variable $PORT to change default express port.
let port = process.env.PORT || 8080;

const app = express();
// Logging
app.use(morgan((tokens, req, res) => {
  let status = tokens.status(req, res);
  switch(Math.trunc(status / 100)) {
  case 1:
    status = chalk.blue(status);
    break;
  case 2:
    status = chalk.green(status);
    break;
  case 3:
    status = chalk.cyan(status);
    break;
  case 4:
    status = chalk.red(status);
    break;
  default:
    status = chalk.magenta(status);
  }
  return [
    chalk.bold(status), chalk.dim(tokens.url(req, res)), tokens["response-time"](req, res), "ms"
  ].join(" ");
}));
app.use(cors());

app.use(express.static("public"));

// Proxy for avoiding CORS issues
app.get("/post", (req, res) => {
  request({
    uri: req.query.q,
    headers: {
      "User-Agent": req.get("User-Agent")
    }
  }, (err, resp) => {
    res.send(err ? err : resp.body);
  });
});

// Image download proxy. Ungzips images and converts to PNG
app.get("/image", (req, res) => {
  const gunzip = zlib.createGunzip();
  const topng = sharp().png();
  res.set({"Content-Type":"image/png"}); // Specifies that this is PNG for <img> tag to use as a source.
  request({
    uri: req.query.q,
    headers: {
      "User-Agent": req.get("User-Agent")
    }
  }).on("error", res.send)
    .pipe(gunzip) // Ungzips the GeoTiffs. Very slow step, probably could be improved.
    .pipe(topng) // Converts Tiff to PNG, as Chrome cannot render Tiffs natively
    .pipe(res); // Sends image over network
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`App running at: http://localhost:${port}/\n`));