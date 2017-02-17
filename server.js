var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

function sendCurrentUsers(socket) {
	var userInfo = clientInfo[socket.id];
	var users = [];

	if (typeof userInfo === 'undefined') {
		return;
	}

	Object.keys(clientInfo).forEach(function(socketID) {
		var info = clientInfo[socketID];

		if (userInfo.room === info.room) {
			users.push(info.name);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Current users: ' + users.join(', '),
		time: moment().valueOf()
	});
} // sendCurrentUsers

io.on('connection', function(socket) {
	console.log('User connected via socket.io!');

	socket.on('disconnect', function() {
		if (typeof clientInfo[socket.id] !== 'undefined') {
			socket.leave(clientInfo[socket.id].room);
			io.to(clientInfo[socket.id].room).emit('message', {
				name: 'System',
				text: clientInfo[socket.id].name + ' has left!',
				time: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}
	});

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

		if (message.text === '@currentUsers') {
			sendCurrentUsers(socket);
		} else {
			message.time = moment().valueOf();
			io.to(clientInfo[socket.id].room).emit('message', message);
		}

		//socket.broadcast.emit('message', message);	// send to anyone except the sender
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