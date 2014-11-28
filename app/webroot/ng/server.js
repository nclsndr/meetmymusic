var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);

var io = require('socket.io')(http);

var Clients = {
	sIdToken : {},
	tokenSId : {}
};
var Peers = {};

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
	socket.on('leaveGame', function(data){
		console.log('leaveGame : ',data.finalToken);
		var finalToken = data.finalToken;
		if (finalToken===false) {
			mmm.leave(socket, function(token, sId){

			});	
		}else{
			mmm.leave(socket, function(token, sId){
				console.log('--- confirmLeaveGame Emit');
				io.to(finalToken).emit('confirmLeaveGame', 'leftGame');
			});	
		}
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

	socket.on('disconnect', function() {
		console.log('a user disconnect : ', socket.id);
		var token = Clients.sIdToken[socket.id];
		
		// console.log('users Object : ',Clients.tokenSId);
		mmm.leave(socket, function(token, sId){

		});
		console.log('----- TOKEN ON DISCONNECT : ', token);
		delete Clients.tokenSId[token];
		delete Clients.sIdToken[socket.id];
		console.log('---- CLIENTS : ', Clients);
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
	rooms : [],
	desktops: new Array(),

	init:function(socket, token, isMobile){
		
		var mobile = false;
		if (typeof mobile!= 'undefined') {
			mobile = isMobile;
		}

		var lSocket = socket;
		var token = ''+token;
		console.log('init token : ', token);
		console.log('init socket id : ', socket.id);

		socket.join(token);
		console.log('isMobile : ', (mmm.desktops.indexOf(token)>-1 && mobile));
		if (mmm.desktops.indexOf(token)>-1 && mobile) {
			mmm.users.add(token+'_M', socket.id);
			mmm.pendings.toRow(token);
			// SEARCH FOR PEER
			mmm.peers.create(lSocket);
		}else{
			mmm.desktops.push(token);
			mmm.users.add(token+'_D', socket.id);
		}
	},
	leave:function(socket, callback){
		console.log('---- Leave fired : ',socket.id);
		var token = Clients.sIdToken[socket.id];
		mmm.peers.destroy(socket);
		mmm.pendings.outRow(token);
		return callback.call(this, token, socket.id);
		// mmm.users.remove(token, socket.id);
	},
	users : {
		add:function(token, sId){
			Clients.tokenSId[token] = sId;
			Clients.sIdToken[sId] = token;
		},
		// remove:function(token, sId){
		// 	delete Clients.tokenSId[sId];
		// 	delete Clients.sIdToken[token];
		// 	console.log('----- sIdToken on users delete : ', Clients.sIdToken);
		// }
	},
	pendings : {
		values : [],
		toRow : function(token){
			mmm.pendings.values.push(token);
		},
		outRowPeer : function(){
			var twin = mmm.pendings.values.splice(0,2);
			console.log('---- outRowPeer : ', twin);
			return twin;
		},
		outRow : function(token){
			if (typeof token != 'undefined') {
				var shortToken = token.slice(-token.length-1,-2);
				var pl = mmm.pendings.values.indexOf(shortToken);
				console.log('------- PL outRow ', pl);
				console.log('------- TOKEN outRow ', shortToken);
				if (pl>-1) {
					return mmm.pendings.values.splice(pl,1);
				}	
			}
		}
	},
	twins : {
		values : new Array(),
		add:function(token){
			mmm.twins.values.push(token);
			console.log('---- set Twins : ', token);
		},
		set:function(socket,token){
			mmm.init(socket, token, true);
		}
	},
	solo : {
		values : new Array(),
		add:function(socket, token){
			var lSocket = socket;
			token = ''+token;
			mmm.pendings.toRow(token);

			console.log('---- set Solo : ', token);
			// SEARCH FOR PEER
			mmm.peers.create(lSocket);
		}
	},
	peers : {
		values : new Array(),
		add:function(finalToken){
			mmm.peers.values.unshift(finalToken);
		},
		create:function(socket){
			console.log('mmm.pendings : ',mmm.pendings.values);
			if (mmm.pendings.values.length>1) {
				var sId;
				var peerArray = mmm.pendings.outRowPeer();
				var finalToken = peerArray[0]+'_'+peerArray[1];

				sId = Clients.tokenSId[peerArray[0]+'_D'];

				io.sockets.connected[sId].join(finalToken);
				
				sId = Clients.tokenSId[peerArray[0]+'_M'];
				if (sId) {
					io.sockets.connected[sId].join(finalToken);	
				}
				
				sId = Clients.tokenSId[peerArray[1]+'_D'];
				io.sockets.connected[sId].join(finalToken);

				sId = Clients.tokenSId[peerArray[1]+'_M'];
				if (sId) {
					io.sockets.connected[sId].join(finalToken);
				}

				mmm.peers.add(finalToken);
				Peers[peerArray[0]] = finalToken;
				Peers[peerArray[1]] = finalToken;
				console.log('---- PEER COMPLETED : ', finalToken);
				io.to(finalToken).emit('finalToken', finalToken);
			}
		},
		destroy:function(socket){

			var token = Clients.sIdToken[socket.id];

			if (typeof token != 'undefined') {
				var finalToken = Peers[token.slice(-token.length-1,-2)];
				console.log('Quit page finalToken : ', finalToken);
				if (typeof finalToken != 'undefined') {
					var peerArray = finalToken.split('_');
					console.log(' ------ Destroy isDesktop : ', token.slice(token.length-1,token.length) != 'M');

					if (token.slice(token.length-1,token.length) != 'M') {

						io.to(finalToken).emit('destroyPeer', 'Peer Destroyed');

						var sId_M0 = Clients.tokenSId[peerArray[0]+'_M'];
						var sId_M1 = Clients.tokenSId[peerArray[1]+'_M'];
						var sId_D0 = Clients.tokenSId[peerArray[0]+'_D'];
						var sId_D1 = Clients.tokenSId[peerArray[1]+'_D'];

						if (typeof sId_D0 != 'undefined' && typeof io.sockets.connected[sId_D0] != 'undefined') {
							io.sockets.connected[sId_D0].leave(finalToken);
						}
						
						if (typeof sId_M0 != 'undefined' && typeof io.sockets.connected[sId_M0] != 'undefined') {
							io.sockets.connected[sId_M0].leave(finalToken);	
						}
						
						if (typeof sId_D1 != 'undefined' && typeof io.sockets.connected[sId_D1] != 'undefined') {
							io.sockets.connected[sId_D1].leave(finalToken);
						}
						
						if (typeof sId_D1 != 'undefined' && typeof io.sockets.connected[sId_M1] != 'undefined') {
							io.sockets.connected[sId_M1].leave(finalToken);
						}
						delete Peers[peerArray[0]];
						delete Peers[peerArray[1]];
					}
				}
			}
		}
	}
}


// var mmm = {
// 	localSocket : null,
// 	rooms : [],
// 	pendings: new Array(),
// 	usersObj : {},
// 	desktops: new Array(),

// 	init:function(socket, token, isMobile){
// 		var mobile = false;
// 		if (typeof mobile!= 'undefined') {
// 			mobile = isMobile;
// 		}
// 		token = ''+token;
// 		console.log('isMobile : ', (mmm.desktops.indexOf(token)>-1 && mobile));
// 		mmm.localSocket = socket;
// 		mmm.localSocket.join(token);
// 		if (mmm.desktops.indexOf(token)>-1 && mobile) {
// 			console.log('init Mobile : ', token);
// 			mmm.pendings.push(token);
// 			mmm.usersObj[token+'_M'] = socket;
// 			mmm.twins.add(token);
// 			// SEARCH FOR PEER
// 			mmm.peers.create();
// 		}else if(mmm.desktops.indexOf(token)==-1){
// 			console.log('init Desktop : ', token);
// 			mmm.desktops.push(token);
// 			mmm.usersObj[token+'_D'] = socket;
// 		}
// 	},
// 	leave:function(token){
// 		// if (token !== 'undefined') {
// 		// 	if (mmm.usersObj.token+'_D') {
// 		// 		delete mmm.usersObj.token+'_D';
// 		// 	}else if (mmm.usersObj.token+'_M') {
// 		// 		delete mmm.usersObj.token+'_M';
// 		// 	}
// 		// }
// 	},
// 	twins : {
// 		values : new Array(),
// 		add:function(token){
// 			mmm.twins.values.push(token);
// 			console.log('set Twins : ', token);
// 		},
// 		set:function(socket,token){
// 			mmm.init(socket, token, true);
// 		}
// 	},
// 	solo : {
// 		values : new Array(),
// 		add:function(socket, token){
// 			token = ''+token;
// 			mmm.solo.values.push(token);
// 			mmm.pendings.push(token);
// 			mmm.usersObj[token+'_D'] = socket;
// 			console.log('set Solo : ', token);
// 			// SEARCH FOR PEER
// 			mmm.peers.create();
// 		}
// 	},
// 	peers : {
// 		values : new Array(),
// 		add:function(finalToken){
// 			mmm.peers.values.unshift(finalToken);
// 		},
// 		create:function(){
// 			console.log('mmm.pendings : ',mmm.pendings.length);
// 			if (mmm.pendings.length>1) {

// 				var finalToken = mmm.pendings[0]+'_'+mmm.pendings[1];

// 				console.log('completed : ', finalToken);
// 				console.log('pendings before peer : ', mmm.pendings);

// 				var user1_D = mmm.usersObj[mmm.pendings[0]+'_D'];
// 				user1_D.join(finalToken);

// 				if (mmm.usersObj[mmm.pendings[0]+'_M']) {
// 					var user1_M = mmm.usersObj[mmm.pendings[0]+'_M'];
// 					user1_M.join(finalToken);
// 				}
				
// 				var user2_D = mmm.usersObj[mmm.pendings[1]+'_D'];
// 				user2_D.join(finalToken);
// 				if (mmm.usersObj[mmm.pendings[1]+'_M']) {
// 					var user2_M = mmm.usersObj[mmm.pendings[1]+'_M'];
// 					user2_M.join(finalToken);
// 				}
// 				mmm.pendings.shift();
// 				mmm.pendings.shift();
// 				mmm.peers.add(finalToken);
				
// 				// io.to(finalToken).emit('finalToken', finalToken);
// 				io.sockets.in(finalToken).emit('finalToken', finalToken);
// 			}
// 		}, 
// 		delete:function(finalToken){

// 			// var splited = finalToken.split('_');

// 			// mmm.usersObj[splited[0]+'_D'].leave(finalToken);
// 			// mmm.usersObj[splited[1]+'_D'].leave(finalToken);

// 			// if (mmm.usersObj[splited[0]+'_M']) {
// 			// 	mmm.usersObj[splited[0]+'_M'].leave(finalToken);
// 			// }
// 			// if (mmm.usersObj[splited[1]+'_M']) {
// 			// 	mmm.usersObj[splited[1]+'_M'].leave(finalToken);
// 			// }

// 		}
// 	}
// }