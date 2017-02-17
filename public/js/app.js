console.log('start');
var socket = io();

socket.on('connection', function() {
	console.log('Connected to socket.io');
});
socket.on('message', function(data) {
	console.log(data);
});