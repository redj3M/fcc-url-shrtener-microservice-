'use strict';

module.exports = function(app, db) {
    var UrlHandler = require(process.cwd() + '/app/controllers/urlHandler.js');
    var handler = new UrlHandler(db);
    
    app.route('/')
        .get(function(req, res) {
            res.sendFile(process.cwd() + '/public/index.html');
        })
    
        
    app.route("/new/*")
        .get(function(req, res) {
            handler.newUrl(req, res);
        })

    app.route('/*')
        .get(function(req, res) {
            handler.getUrl(req, res);
        })
}