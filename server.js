var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

io.on('connection', function(socket) {
	console.log('User connected via socket.io!');

	socket.on('joinRoom', function(req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined!',
			time: moment().valueOf()
		});
	});

	socket.on('message', function(message) {
		console.log('message received: ' + message.text);
		//socket.broadcast.emit('message', message);	// send to anyone except the sender
		message.time = moment().valueOf();
		io.to(clientInfo[socket.id].room).emit('message', message);
	});

	socket.emit('message', {
		name: 'System',
		time: moment().valueOf(),
		text: 'Welcome to chat app!'
	});
});

http.listen(PORT, function() {
	console.log('Server started...');
});