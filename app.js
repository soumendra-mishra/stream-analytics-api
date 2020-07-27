require("dotenv").config();
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const pubSubMessageController = require('./controllers/pubSubMessageController');

app.use(bodyParser.json());
app.post('/', (req, res) => {
  pubSubMessageController.index(req, res);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;