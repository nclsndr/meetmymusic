var app = require('express')();
var http = require('http').Server(app);

var io = require('socket.io')(http);

io.on('connection', function(socket){
	console.log('a user connected');
	// console.log(socket.request);
	socket.on('message', function(msg){
		console.log(msg);
		console.log('Time message : %d', Date.now());
		io.emit('message', msg);
	});

	socket.on('sound', function(soundId){
		console.log('Sound ID : ',soundId);
		console.log('Time: %d', Date.now());
		io.emit('soundR', soundId);
	});
});

app.get('/', function(req, res){
	res.sendfile(__dirname+'/index.html');
});
app.get('/mobile', function(req, res){
	res.sendfile(__dirname+'/mobile.html');
});

// Login Redirect URI from SoundCloud API
app.get('/scauth', function(req, res){
	res.sendfile(__dirname+'/node_tpl/auth_sc.html');
});

// app.use(function (req, res, next) {
// 	var action = req.url.split('/');
// 	var authToken = '';

// 	if (action.indexOf('qr')>-1) {
// 		authToken = action[2];
// 	}

// 	io.on('connection', function(socket){

// 	  socket.emit('authToken', authToken);

// 	});
// 	res.sendfile('index.html');
//   console.log('Time: %d', Date.now());
// });


http.listen(3000, function(){
	console.log('listening on *:3000');
});

