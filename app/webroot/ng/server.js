var app = require('express')();
var http = require('http').Server(app);

var io = require('socket.io')(http);
io.on('connection', function(socket){
	console.log('a user connected');
	// console.log(socket.request);
	socket.on('message', function(msg){
		console.log(msg);
		io.emit('message', msg);
	});
});


app.get('/', function(req, res){
	res.sendfile('index.html');
});

app.use(function (req, res, next) {
	console.log(req.url);
	io.on('connection', function(socket){
		// LOGIQUE CONDITIONNELLE DU TRAITEMENT TOKEN
	  io.emit('message', req.url);
	});
	res.sendfile('index.html');
  console.log('Time: %d', Date.now());
});




http.listen(3000, function(){
	console.log('listening on *:3000');
});



// var url = require('url');
// var qString = require('querystring');
// var fs = require('fs');

// fs.readFile('index.html', function (err, data) {
//     if (err) {
//         throw err;
//     }
//     index = data;
// });

// var http = require('http');
// var server = http.createServer(function(req, res){
// 	res.writeHead('200');
// 	var page = url.parse(req.url).pathname;
// 	console.log(page);
// 	var params = qString.parse(url.parse(req.url).query);
// 	console.log(params);
// 	res.write(index);
// 	res.end();
// });

// server.listen(3000, function(){
// 	console.log("server listening on :3000");
// });



