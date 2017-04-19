/**
 * Created by Jordan.Ross on 4/18/2017.
 */
console.log('Loading server...');
const WEB = `${__dirname}/web`;

let express = require('express');
let app = express();

//load express third-party middleware modules
let logger = require('morgan');
let compression = require('compression');
let favicon = require('serve-favicon');
let rest = require('./BookREST');

app.use(logger('dev'));
app.use(compression());
app.use(favicon(`${WEB}/favicon.png`));
app.use('/', rest);

//Serve up static files
app.use(express.static(WEB));

//start server
app.listen(8080, function () {
    console.log('Listening on port 8080');
});