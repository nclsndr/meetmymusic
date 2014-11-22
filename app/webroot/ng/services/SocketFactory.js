mmmApp.factory('SocketFactory', ['socketFactory', 
function (socketFactory) {
	var myIoSocket = io.connect('http://mmm.nclsndr.fr:3000');
	mySocket = socketFactory({
		ioSocket: myIoSocket
	});
	return mySocket;
}]);

// mmmApp.factory('SiO', ['socketFactory', function(socketFactory){
// 	var Factory = {
// 		init:function()
// 	};
// 	return Factory;
// }]);