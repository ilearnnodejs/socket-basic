var name = getQueryVariable('name') || 'anonymous';
var room = getQueryVariable('room');

console.log(name + ' ' + room);

var socket = io();

socket.on('connection', function() {
	console.log('Connected to socket.io');
});
socket.on('message', function(data) {
	var time = moment.utc(data.time);
	var message = jQuery('#messages');

	message.append('<p><strong>' + data.name + ' ' + time.local().format('hh:mma') + '</strong></p>');
	message.append('<p>' + data.text + '</p>');
});

// handle submitting new message
var frm = jQuery('#message-form');

frm.on('submit', function(e) {
	e.preventDefault();
	var message = frm.find('input[name="message"]');

	socket.emit('message', {
		name: name,
		text: message.val()
	});

	message.val('');
});