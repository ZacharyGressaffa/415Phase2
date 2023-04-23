const { MongoClient } = require("mongodb");
const uri = 'mongodb+srv://zacharygressaffa:Password@415phase2.l4aijyg.mongodb.net/?retryWrites=true&w=majority'
const express = require('express');
const app = express();
const port = 3000;
const client = new MongoClient(uri, {useUnifiedTopology : true})
const db = client.db('415DB')
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(port);
console.log('Server started at http://localhost/:' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    const myquery = req.query;
    var outstring = 'Starting... ';
    res.send(outstring);
});

//get ticket by id
app.get('/rest/ticket/:item', function(req, res) {
    const client = new MongoClient(uri);
    const searchKey = parseInt(req.params.item);
    console.log("Looking for: " + searchKey);

    async function run() {
        try {
            const database = client.db('415DB');
            const parts = database.collection('415Collection');

            const query = { ticketId: searchKey };

            const part = await parts.findOne(query);
            console.log(part);
            res.send('Found this: ' + JSON.stringify(part));

        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);
})

//get all tickets
app.get('/rest/list', function(req, res) {
    const client = new MongoClient(uri);

    async function run() {
        try {
            const database = client.db('415DB');
            const parts = database.collection('415Collection');

            const results = await parts.find().toArray();
            console.log(results);
            res.send('Found these: ' + JSON.stringify(results));

        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);
});

//delete ticket
app.delete('/rest/ticket/:item', function(req, res) {
    const client = new MongoClient(uri);
    const searchKey = parseInt(req.params.item);
    console.log("Deleting ticket with id: " + searchKey);

    async function run() {
        try {
            const database = client.db('415DB');
            const parts = database.collection('415Collection');

            const query = { ticketId: searchKey };

            const result = await parts.deleteOne(query);
            console.log(result);
            res.send('Deleted this: ' + JSON.stringify(result));

        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);
});
app.get('/delete/ticket', function(req, res) {
    res.sendFile(__dirname + '/frontend3.html');
});

//create new ticket
app.post('/rest/ticket', function(req, res) {
    const client = new MongoClient(uri);

    async function run() {
        try {
            const database = client.db('415DB');
            const parts = database.collection('415Collection');
            const result = await parts.insertOne(req.body);
            console.log(result);
            res.send(result);
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);
});
app.get('/update/ticket', function(req, res) {
    res.sendFile(__dirname + '/frontend.html');
});

//update ticket
app.put('/rest/ticket/:item', function(req, res) {
    const client = new MongoClient(uri);
    const searchKey = { ticketId: parseInt(req.params.item) };
    const updateData = { $set: req.body };

    async function run() {
        try {
            const database = client.db('415DB');
            const parts = database.collection('415Collection');
            const result = await parts.updateOne(searchKey, updateData);
            console.log(result);
            res.send(result);
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);
});
app.get('/update-ticket', function(req, res) {
    res.sendFile(__dirname + '/frontend2.html');
});