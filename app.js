'use strict';

const express = require('express'),
			serveStatic = require('serve-static'),
			jsforceAjaxProxy = require('jsforce-ajax-proxy'),
			https = require('https'),
			fs = require('fs');

let app = express();

//you won't need 'connect-livereload' if you have livereload plugin for your browser
app.use(require('connect-livereload')());
app.use('/', serveStatic('build'));
app.use('/node_modules', serveStatic('node_modules'));
app.all('/proxy/?*', jsforceAjaxProxy({ enableCORS: true }));

let privateKey  = fs.readFileSync('.ssh/domain.key', 'utf8');
let certificate = fs.readFileSync('.ssh/domain.crt', 'utf8');
let credentials = {key: privateKey, cert: certificate};

let server = https.createServer(credentials, app);
server = server.listen(8080, function() {
	console.log('https listening on port 8080')
});
