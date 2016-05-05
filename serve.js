'use strict';

const
    express = require('express'),
    compression = require('compression'),
    app = express();

app.use(express.static(__dirname + '/public'));
app.use(compression());
app.listen(3000);
console.log('Listening on 0.0.0.0:3000');
