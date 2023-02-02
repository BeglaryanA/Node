const express = require('express');
const app = express();
const { type } = require('os');
const { send } = require('process');
const { stringify } = require('querystring');

const PORT = process.env.PORT || 8000;

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

const clientGlob = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = clientGlob.db('Engine');
const document = db.collection('document');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Home page');
});

app.get('/search', (req, res) => {
    if (req.query.q === undefined) {
        throw new Error("Wrong query");
    }
    const query = req.query.q;
    document.find({ content: { $regex: query } }).toArray((err, result) => {
        result.forEach(elem => sendResult.push(elem.name));
        res.send((sendResult));
    });
});

app.post('/files', (req, res) => {
    const fileName = req.body.name;
    const fileContent = req.body.content;

    document.findOneAndUpdate(
        { name: fileName },
        { $set: { content: fileContent } },
        { upsert: true, returnOriginal: false },
        (err, result) => {
            res.send('Succes!!!!');
        }
    );
});

// clientGlob.close();
app.listen(PORT);