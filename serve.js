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

function matchesFilter(filter, o) {
    filter = filter.toLowerCase();

    for (let k in o) {
        if (o.hasOwnProperty(k)) {
            let v = o[k];
            if (v.toLowerCase().indexOf(filter) > -1) {
                return true;
            }
        }
    }
}

app.use(express.static(__dirname + '/public'));
app.use(compression());
app.listen(3000);


function compare(sortOrder, a, b) {
    if (sortOrder === 'asc') {
        return a < b;
    } else {
        return a > b;
    }
}

app.get('/data/:maxRows', function(req, res) {
    let _data = data[req.params.maxRows],
        totalRecords = _data.length,
        offset = req.query.offset,
        pageSize = req.query.pageSize,
        filter = req.query.filter,
        sortBy = req.query.sortBy,
        sortOrder = req.query.sortOrder;

    if (filter) {
        _data = _data.filter(_d => matchesFilter(filter, _d));
        totalRecords = _data.length;
    }

    // todo: loop only once to filter and sort.
    if (sortBy) {
        _data = _data.sort((a, b) => compare(sortOrder, a[sortBy], b[sortBy]) ? -1 : 1);
    }

    if (offset && pageSize) {
        _data = _data.slice(offset, offset + pageSize);
    }

    res.header('Content-Type', 'application/json');
    res.end(JSON.stringify({
        rows: _data,
        totalRecords
    }));
});

console.log('Listening on 0.0.0.0:3000');
