var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var WebSocket = require('ws');

var server = http.createServer();
server.listen(9001);
console.log("\nServer listening on 9001...\n");

var customerIdSes = '';

server.on('request', function(req, res) {

	var url_parts = url.parse(req.url, true);
	
	var filePath = '.' + req.url; 
	if(filePath == './') {
		filePath = './LogIn.html';
	}
	if(req.url.substring(1, 6) == 'Custo') {
		console.log('\n Request URL: %s', req.url);
		console.log('\n CustomerId: %s', req.url.substring(12));
		customerIdSes = req.url.substring(12);
		filePath = './CustDashboard.html';
	}
			
	var extname = path.extname(filePath);
	var contentType = 'text/html';
			
	switch(extname) {
		case '.js': 
			contentType = 'text/javascript'; 
			break;
			
		case '.css':
			contentType = 'text/css';
			break;
			
		case '.woff':
			contentType = 'application/font-woff';
			break;
			
		case '.ttf':
			contentType = 'application/font-ttf';
			break;
		
		case '.min.js':
			contentType = 'text/javascript';
			break;
			
	}
			
	path.exists(filePath, function(exists) {
		if(exists) {
			fs.readFile(filePath, function(error, content) {
				if(error) {
					res.writeHead(500); 
					res.end();
				} 
				else {
					res.writeHead(200, { 'Content-Type' : contentType });
					res.end(content, 'utf-8'); 
				} 
			}); 
		} 
		else {
			res.writeHead(404);
			res.end(); 
		}
	});

});

var WebSocketServer = WebSocket.Server;

//Bill Messages Subscriber
var wss = new WebSocketServer({port: 9002});

wss.on('connection', function(ws) {
	console.log('**********Connected to client for Bill message***********');
   
	var wsBill = new WebSocket('ws://localhost:8091/websocket/billevent');
	wsBill.on('open', function() {
		console.log('************Bill message connection established with Mule Server**************');
		var signInMsg = { userAction:'SignIn', customerId:customerIdSes, additionalInfo:'' };
		console.log('\nSending SignIn message to Esper: %s\n', JSON.stringify(signInMsg));
		setTimeout(function() {
			wsBill.send(JSON.stringify(signInMsg));
		}, 3000);
	});
	
	wsBill.on('message', function(message) {
		console.log('\n\nBill message received from Esper: \n\n%s', message);
		ws.send(message);
	});
	
	wsBill.on('disconnect', function() {
		console.log('************Bill Message connection terminated with Mule Server**************');
	});
	
	ws.on('disconnect', function(message) {
        console.log('**********Disconnected from client***********');
    });
	
	ws.on('message', function(message) {
        console.log('Received: %s', message);
		wsBill.send(message);
    });
	
	wsBill.on('error',function(message) {
		console.log('\n\n\nError in Bill controller: \n\n%s', message);
	});
});

//Alert Messages Subscriber
var wss2 = new WebSocketServer({port: 9003});

wss2.on('connection', function(ws) {
	console.log('**********Connected to client for Alert message***********');
    
	var wsBill = new WebSocket('ws://localhost:8092/websocket/alertmessageccevent');
	wsBill.on('open', function() {
		console.log('************Alert message connection established with Mule Server**************');
		wsBill.send(customerIdSes);
	});
	
	wsBill.on('message', function(message) {
		console.log('\n\n\nAlert message received from Esper: \n\n%s', message);
		ws.send(message);
	});
	
	wsBill.on('disconnect', function() {
		console.log('************Alert message connection terminated with Mule Server**************');
	});
	
	ws.on('message', function(message) {
        console.log('Received: %s', message);
		wsBill.send(message);
    });
});

