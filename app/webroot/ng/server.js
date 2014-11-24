
var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);

var io = require('socket.io')(http);

io.on('connection', function(socket){
	console.log('A user connected');

	socket.on('initTwins', function(token){
		mmm.init(socket,token);
		io.to(token).emit('confirmInitTwins', 'initOk');
	});
	socket.on('setTwins', function(token){
		mmm.twins.set(socket,token);
		io.to(token).emit('confirmSetTwins', 'twinsOk');
	});
	socket.on('setSolo', function(token){
		mmm.solo.add(socket, token);
		io.to(token).emit('confirmSetSolo', 'soloOk');
	});

	

	// Routine de passage multi-duplex
	socket.on('mmmRouter', function(stored){
		console.log('mmmRouter : ', stored.ev);
		console.log('To : ', stored.to);
		io.to(stored.to).emit(stored.ev, stored.data);
	});
	// Routine de passage broadcast multi-duplex
	socket.on('mmmRouterBroadcast', function(stored){
		console.log('mmmRouterBroadcast : ', stored.ev);
		console.log('To : ', stored.to);
		socket.broadcast.to(stored.to).emit(stored.ev, stored.data);
	});
	// EX :
	// var store = {
	// 	to : UserFactory.token.peer,
	// 	ev : 'setForeignTrack',
	// 	data : {
	// 		trackId : SoundcloudService.foreignTrackId
	// 	}
	// };
	// SocketFactory.emit('mmmRouter', store);

	socket.on('leaveRooms', function(data){
		console.log('leaveRooms : ',data.finalToken);
		// mmm.peers.delete(data.finalToken);
	});

	socket.on('disconnect', function(token) {
      console.log('a user disconnect : ', token);
      // console.log('users Object : ',mmm.usersObj);
      mmm.leave(token);
   });

});

// app.use(express.static(path.join(__dirname, 'public')));

app.get('/mobile/:token', function(req, res){
	res.sendfile(__dirname+'/mobile.html');
});
app.get('/mobile/', function(req, res){
	res.sendfile(__dirname+'/mobile.html');
});
// Login Redirect URI from SoundCloud API
app.get('/scauth', function(req, res){
	res.sendfile(__dirname+'/node_tpl/auth_sc.html');
});
app.get('/', function(req, res){
	res.sendfile(__dirname+'/index.html');
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

var mmm = {
	localSocket : null,
	rooms : [],
	pendings: new Array(),
	usersObj : {},
	desktops: new Array(),

	init:function(socket, token, isMobile){
		var mobile = false;
		if (typeof mobile!= 'undefined') {
			mobile = isMobile;
		}
		token = ''+token;
		console.log('isMobile : ', (mmm.desktops.indexOf(token)>-1 && mobile));
		mmm.localSocket = socket;
		mmm.localSocket.join(token);
		if (mmm.desktops.indexOf(token)>-1 && mobile) {
			console.log('init Mobile : ', token);
			mmm.pendings.push(token);
			mmm.usersObj[token+'_M'] = socket;
			mmm.twins.add(token);
			// SEARCH FOR PEER
			mmm.peers.create();
		}else if(mmm.desktops.indexOf(token)==-1){
			console.log('init Desktop : ', token);
			mmm.desktops.push(token);
			mmm.usersObj[token+'_D'] = socket;
		}
	},
	leave:function(token){
		if (token !== 'undefined') {
			if (mmm.usersObj.token+'_D') {
				delete mmm.usersObj.token+'_D';
			}else if (mmm.usersObj.token+'_M') {
				delete mmm.usersObj.token+'_M';
			}
		}
	},
	twins : {
		values : new Array(),
		add:function(token){
			mmm.twins.values.push(token);
			console.log('set Twins : ', token);
		},
		set:function(socket,token){
			mmm.init(socket, token, true);
		}
	},
	solo : {
		values : new Array(),
		add:function(socket, token){
			token = ''+token;
			mmm.solo.values.push(token);
			mmm.pendings.push(token);
			mmm.usersObj[token+'_D'] = socket;
			console.log('set Solo : ', token);
			// SEARCH FOR PEER
			mmm.peers.create();
		}
	},
	peers : {
		values : new Array(),
		add:function(finalToken){
			mmm.peers.values.unshift(finalToken);
		},
		create:function(){
			console.log('mmm.pendings : ',mmm.pendings.length);
			if (mmm.pendings.length>1) {

				var finalToken = mmm.pendings[0]+'_'+mmm.pendings[1];

				console.log('completed : ', finalToken);
				console.log('pendings before peer : ', mmm.pendings);

				var user1_D = mmm.usersObj[mmm.pendings[0]+'_D'];
				user1_D.join(finalToken);

				if (mmm.usersObj[mmm.pendings[0]+'_M']) {
					var user1_M = mmm.usersObj[mmm.pendings[0]+'_M'];
					user1_M.join(finalToken);
				}
				
				var user2_D = mmm.usersObj[mmm.pendings[1]+'_D'];
				user2_D.join(finalToken);
				if (mmm.usersObj[mmm.pendings[1]+'_M']) {
					var user2_M = mmm.usersObj[mmm.pendings[1]+'_M'];
					user2_M.join(finalToken);
				}
				mmm.pendings.shift();
				mmm.pendings.shift();
				mmm.peers.add(finalToken);
				
				// io.to(finalToken).emit('finalToken', finalToken);
				io.sockets.in(finalToken).emit('finalToken', finalToken);
			}
		}, 
		delete:function(finalToken){

			var splited = finalToken.split('_');

			mmm.usersObj[splited[0]+'_D'].leave(finalToken);
			mmm.usersObj[splited[1]+'_D'].leave(finalToken);

			if (mmm.usersObj[splited[0]+'_M']) {
				mmm.usersObj[splited[0]+'_M'].leave(finalToken);
			}
			if (mmm.usersObj[splited[1]+'_M']) {
				mmm.usersObj[splited[1]+'_M'].leave(finalToken);
			}

		}
	}
}