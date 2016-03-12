'use strict';

function urlHandler(db) {
    var urls = db.collection('urls');
    
    var randomUrlCode = function() {
        var str = [];
        var c;
        for (var i = 0; i < 4; i++) {
            c = Math.floor((Math.random() * 62));
            if (c < 10) {
                str.push(String.fromCharCode(c + 48));
            } else if (c >= 36) {
                str.push(String.fromCharCode(c + 61));
            } else {
                str.push(String.fromCharCode(c + 55));
            }
        }
        return str.join('');
    };
    
    var checkAvailable = function(urlCode, url, req, res) {
        urls.findOne(
            { 'urlCode': urlCode },
            { '_id': false },
            function(err, results) {
                if (err) {
                    throw(err)
                }
                
                if (results === null) {
                    urls.insert( {'urlCode': urlCode, 'urlString':url }, function(err) {
                        if (err) {
                            throw err;
                        }
                        
                        res.send({
                            'original': url,
                            'shortened': 'http://' + req.headers.host + '/' + urlCode
                        });
                    });
                } else {
                    checkAvailable(randomUrlCode(), url);
                }
            }
        );
    };
    
    this.getUrl = function(req, res) {
        urls.findOne(
            { 'urlCode': req.url.slice(1) },
            { '_id': false, 'urlCode': false },
            function(err, results) {
                if (err) {
                    throw error;
                }
                
                if (results === null) {
                    res.send('shorened url not found');
                } else {
                    res.redirect(results.urlString);
                }
            }
        );
    };
    
    this.newUrl = function(req, res) {
        var url = req.url.slice(5);
        if ((url.slice(0, 7) === 'http://' && url.indexOf('.') > 7) || (url.slice(0, 8) === 'https://' && url.indexOf('.') > 8)) {
            urls.findOne(
                { 'urlString': url },
                { '_id': false },
                function(err, results) {
                    if (err) {
                        throw error;
                    }
                    
                    if (results === null) {
                        checkAvailable(randomUrlCode(), url, req, res);
                    } else {
                        res.send({
                            'original': results.urlString,
                            'shortened': 'http://' + req.headers.host + '/' + results.urlCode
                        });
                    }
                }
            );
        } else {
            res.send('url invalid')
        }
    }
}

module.exports = urlHandler;

