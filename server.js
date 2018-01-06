const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/test");

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const dbUrl = "mongodb://alex:busey12@ds245277.mlab.com:45277/node-chat-app";

const Message = mongoose.model("Message", {
  name: String,
  message: String
});

app.get("/messages", (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.post("/messages", (req, res) => {
  if (req.body.name && req.body.message) {
    const message = new Message(req.body);
    message.save(err => {
      if (err) {
        sendStatus(500);
      } else {
        io.emit("message", req.body);
        res.sendStatus(200);
      }
    });
  }
});

io.on("connection", socket => {
  console.log("a user connected");
});

mongoose.connect(dbUrl, err => {
  console.log("mongo db connection", err);
});

const server = http.listen(3000, () => {
  console.log("server is listening on port", server.address().port);
});
