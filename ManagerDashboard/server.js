var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var WebSocket = require('ws');

var server = http.createServer();
server.listen(8001);

console.log('\nWeb Server running at port 8001...\n');

server.on('request', function(req, res) {

	var url_parts = url.parse(req.url, true);
	
	var filePath = '.' + req.url; 
	if(filePath == './') {
		filePath = './OMView.html';
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
			res.write('404');
			res.end(); 
		}
	});

});

var WebSocketServer = WebSocket.Server;

//Alert Messages Subscriber
var wss = new WebSocketServer({port: 8002});

wss.on('connection', function(ws) {
	console.log('**********Connected to dashboard for Alert message***********');
    ws.on('message', function(message) {
        console.log('received: %s', message);
    });
	
	var wsAlerts = new WebSocket('ws://localhost:8093/websocket/alertmessageomevent');
	wsAlerts.on('open', function() {
		console.log('************Alert connection established with Mule Server**************');
		wsAlerts.send('test');
	});
	
	wsAlerts.on('message', function(message) {
		console.log('\n\n\nAlert message received from Esper: \n\n%s', message);
		ws.send(message);
	});
	
	wsAlerts.on('disconnect', function() {
		console.log('************Alert connection terminated with Mule Server**************');
	});
});


//Top Buyers Subscriber
var wss2 = new WebSocketServer({port: 8003});

wss2.on('connection', function(ws) {
	console.log('**********Connected to dashboard for Top Buyers message***********');
    ws.on('message', function(message) {
        console.log('received: %s', message);
    });
	
	var wsTopBuyer = new WebSocket('ws://localhost:8093/websocket/topbuyerlistevent');
	wsTopBuyer.on('open', function() {
		console.log('************Top Buyers connection established with Mule Server**************');
		wsTopBuyer.send('test');
	});
	
	wsTopBuyer.on('message', function(message) {
		console.log('\n\n\nTop Buyers message received from Esper: \n\n%s', message);
		ws.send(message);
	});
	
	wsTopBuyer.on('disconnect', function() {
		console.log('************Top Buyers connection terminated with Mule Server**************');
	});
});

//Most Sold Products Subscriber
var wss3 = new WebSocketServer({port: 8004});

wss3.on('connection', function(ws) {
	console.log('**********Connected to dashboard for Most Sold Products message***********');
    ws.on('message', function(message) {
        console.log('received: %s', message);
    });
	
	var wsMostSold = new WebSocket('ws://localhost:8094/websocket/topsellingitemlistevent');
	wsMostSold.on('open', function() {
		console.log('************Most Sold Products connection established with Mule Server**************');
		wsMostSold.send('test');
	});
	
	wsMostSold.on('message', function(message) {
		console.log('\n\n\nMost Sold Products received from Esper: \n\n%s', message);
		ws.send(message);
	});
	
	wsMostSold.on('disconnect', function() {
		console.log('************Most Sold Products connection terminated with Mule Server**************');
	});
});

//Products Low in Stock Subscriber
var wss4 = new WebSocketServer({port: 8005});

wss4.on('connection', function(ws) {
	console.log('**********Connected to dashboard for Products Low in Stock message***********');
    ws.on('message', function(message) {
        console.log('received: %s', message);
    });
	
	var wsLowStock = new WebSocket('ws://localhost:8095/websocket/lowstocklistevent');
	wsLowStock.on('open', function() {
		console.log('************Products Low in Stock connection established with Mule Server**************');
		wsLowStock.send('test');
	});
	
	wsLowStock.on('message', function(message) {
		console.log('\n\n\nProducts Low in Stock received from Esper: \n\n%s', message);
		ws.send(message);
	});
	
	wsLowStock.on('disconnect', function() {
		console.log('************Products Low in Stock connection terminated with Mule Server**************');
	});
});


//HeatMap Subscriber
var wss5 = new WebSocketServer({port: 8006});

wss5.on('connection', function(ws) {
	console.log('**********Connected to dashboard for HeatMap message***********');
    ws.on('message', function(message) {
        console.log('received: %s', message);
    });
	
	var wsLowStock = new WebSocket('ws://localhost:8096/websocket/heatmapevent');
	wsLowStock.on('open', function() {
		console.log('************HeatMap connection established with Mule Server**************');
		wsLowStock.send('test');
	});
	
	wsLowStock.on('message', function(message) {
		console.log('\n\n\nHeatMap received from Esper: \n\n%s', message);
		ws.send(message);
	});
	
	wsLowStock.on('disconnect', function() {
		console.log('************HeatMap connection terminated with Mule Server**************');
	});
});
