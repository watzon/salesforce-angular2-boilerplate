'use strict';

const express = require('express'),
			serveStatic = require('serve-static'),
			jsforceAjaxProxy = require('jsforce-ajax-proxy'),
			http = require('http'),
			// https = require('https'),
			fs = require('fs');

let app = express();

//you won't need 'connect-livereload' if you have livereload plugin for your browser
app.use(require('connect-livereload')());
app.use('/', serveStatic('build'));
app.use('/node_modules', serveStatic('node_modules'));
app.all('/proxy/?*', jsforceAjaxProxy({ enableCORS: true }));

// let privateKey  = fs.readFileSync('.ssh/domain.key', 'utf8');
// let certificate = fs.readFileSync('.ssh/domain.crt', 'utf8');
// let credentials = {key: privateKey, cert: certificate};

let server = http.createServer(app);
server = server.listen(8085, function() {
	console.log('http listening on port 8085')
});

// let httpsServer = https.createServer(credentials, app);
// httpsServer = httpsServer.listen(8080, function() {
// 	console.log('https listening on port 8080')
// });
