'use strict';

const
    express = require('express'),
    compression = require('compression'),
    app = express(),
    data = require('./data/data99.js');

app.use(express.static(__dirname + '/public'));
app.use(compression());
app.listen(3000);

app.get('/data', function(req, res) {
    res.header('Content-Type', 'application/json');
    res.end(JSON.stringify({
        rows: data,
        totalRecords: data.length,
        limit: 100
    }));
});

console.log('Listening on 0.0.0.0:3000');
