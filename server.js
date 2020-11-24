const express = require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { MongoClient, ObjectId } = require('mongodb')
const path = require('path');
const cors = require('cors')

const app = express();
const mongoClient = new MongoClient("mongodb://localhost:27017/");

let dbClient;
let collection;

let initialCategories = {
    'favorites': [
      'AAPL',
      'TSLA',
      'AMZN',
      'NFLX',
      'FB'
    ]
}



app.use(express.static(path.join(__dirname, 'build')));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.text());
app.use(cookieParser());

mongoClient.connect((err, client) => {
    if (err) return console.log(err.message);
    dbClient = client;
    collection = client.db("userdb").collection("users");
    app.listen(8080, () => console.log("Waiting for connection..."));
});

app.use((request, response, next) => { // check/set token
    if (!request.cookies.token) {
        collection.insertOne({ ...initialCategories }, function(error, result) {
            if (error) return console.log(error.message);
            request.token = result.insertedId.toString();
            response.cookie('token', request.token);
            next();
        })
    }
    else {
        request.token = request.cookies.token;
        next();
    }
});

app.get("/api/categories", function (request, response) {

    collection.findOne({ _id: ObjectId(request.token) }, function (error, categories) {
        console.log(request.cookies)
        if (error) return console.log(error.message);
        delete categories._id;
        response.send(categories);
    })
})

app.post("/api/categories", function (request, response) {
    collection.findOneAndUpdate( {_id: ObjectId(request.token) }, { $set: { [request.body]: []} }, { returnOriginal: false }, function (err, result) { 
        console.log(result);
        response.send(result.ops);
    })
})

app.post("/api/categories/:categoryName", function (request, response) {
    collection.findOneAndUpdate( {_id: ObjectId(request.token) }, { $addToSet: { [request.params.categoryName]: request.body } }, { returnOriginal: false }, function (err, result) { 
        console.log(result);
        response.send(result.ops);
    })
})

process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});