console.log('start');
var socket = io();

socket.on('connection', function() {
	console.log('Connected to socket.io');
});
socket.on('message', function(data) {
	console.log(data);
});

// handle submitting new message
var frm = jQuery('#message-form');

frm.on('submit', function(e) {
	e.preventDefault();
	var message = frm.find('input[name="message"]');

	socket.emit('message', {
		text: message.val()
	});

	message.val('');
});