"use strict";

require("dotenv").config();
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express();

const pubSubMessageController = require('./controllers/pubSubMessageController');

app.use(bodyParser.json());
app.use(cors());

app.get("/", function (req, res) {
  res.status(200).send('API is Running...').end();
});

app.post('/', (req, res) => {
  pubSubMessageController.index(req, res);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;