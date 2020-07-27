const axios = require("axios");
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const { BigQuery } = require('@google-cloud/bigquery');
const bigquery = new BigQuery();
const path = require('path');
const cwd = path.join(__dirname, '..');
const fs = require('fs')

async function readStorageBucket(pubsubMsg) {
    const bucketName = pubsubMsg.bucket;
    const blobName = pubsubMsg.name;
    const destFileName = path.join(cwd, 'download.json');
    const options = { destination: destFileName };

    await storage.bucket(bucketName).file(blobName).download(options);
    console.log(`gs://${bucketName}/${blobName} downloaded to ${destFileName}.`);

    const jsonData = fs.readFileSync('download.json', 'utf-8');
    return jsonData;
}

async function insertRowsAsStream(messages) {
    var rowsList = [];
    try {
        var rows = messages.split("\n");
        for (var i = 0; i < rows.length; i++) {
            rowsList.push(JSON.parse(rows[i]));
        }
    } catch{
        rowsList = messages;
    }

    await bigquery.dataset("bq_poc").table("txn_msg").insert(rowsList);
    const response = `Record Inserted = ${rowsList.length}`;
    return response;
}

exports.index = async function (req, res) {
    const pubSubMessage = req.body.message;

    try {
        const pubsubMsg = JSON.parse(Buffer.from(pubSubMessage.data, 'base64').toString().trim());
        const response = await readStorageBucket(pubsubMsg);
        const result = await insertRowsAsStream(response);
        res.status(200).send(result);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
};