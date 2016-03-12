'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongo = require('mongodb').MongoClient;
var port = process.env.PORT;

var app = express();

mongo.connect('mongodb://localhost:27017/clementinejs', function(err, db) {
    if (err) {
        throw err;
    } else {
        console.log('MongoDB successfully connected on port 27017.');
    }
    
    routes(app,db);
    
    app.listen(port, function() {
        console.log('Listening on port ' + port + '...');
    });
});