console.log('start');
var socket = io();

socket.on('connection', function() {
	console.log('Connected to socket.io');
});