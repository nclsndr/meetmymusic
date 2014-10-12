var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var url = require('url');
var qString = require('querystring');

app.get('/', function(req, res){
	res.sendfile('index.html');
});

io.on('connection', function(socket){
	console.log('a user connected');
	// console.log(socket.request);
	socket.on('message', function(msg){
		console.log(msg);
		io.emit('message', msg);
	});
});




// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     io.emit('chat message', msg);
//   });
// });

http.listen(3000, function(){
	console.log('listening on *:3000');
});