const express = require("express");
const server = express();
const user_Router = require("./users/userRouter");

server.use(express.json());

//custom middleware
server.use(logger);

server.use("/api/users", user_Router);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

function logger(req, res, next) {
  const { path } = req;
  const timeStamp = Date.now();
  const log = { path, timeStamp };
  console.log(`${req.method} Request`, log);
  next();
}

module.exports = server;
