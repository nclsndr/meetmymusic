mmmApp.factory('socket', ['socketFactory', 
function (socketFactory) {
	var myIoSocket = io.connect('http://mmm.nclsndr.fr:3000');
	mySocket = socketFactory({
		ioSocket: myIoSocket
	});
	return mySocket;
}]);