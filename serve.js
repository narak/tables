'use strict';

const
    express = require('express'),
    compression = require('compression'),
    app = express(),
    data = {
        100: require('./data/data100.js'),
        200: require('./data/data200.js'),
        500: require('./data/data500.js')
    };

app.use(express.static(__dirname + '/public'));
app.use(compression());
app.listen(3000);

app.get('/data/:maxRows', function(req, res) {
    let _data = data[req.params.maxRows],
        offset = req.query.offset,
        pageSize = req.query.pageSize;

    if (offset && pageSize) {
        _data = _data.slice(offset, offset + pageSize);
    }

    res.header('Content-Type', 'application/json');
    res.end(JSON.stringify({
        rows: _data,
        totalRecords: data[req.params.maxRows].length
    }));
});

console.log('Listening on 0.0.0.0:3000');
