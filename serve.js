'use strict';

const
    express = require('express'),
    compression = require('compression'),
    app = express(),
    data = {
        99: require('./data/data99.js'),
        200: require('./data/data200.js'),
        500: require('./data/data500.js')
    };

app.use(express.static(__dirname + '/public'));
app.use(compression());
app.listen(3000);

app.get('/data/:maxRows', function(req, res) {
    let _data = data[req.params.maxRows];

    res.header('Content-Type', 'application/json');
    res.end(JSON.stringify({
        rows: data[req.params.maxRows],
        totalRecords: _data.length,
        limit: _data.length
    }));
});

console.log('Listening on 0.0.0.0:3000');
