/* Services */
app.service('SharedProperties', function () {
	var customerId = '';
	var transactionLogs = [];
	var customer=[];
	
	return {
		getCustomerId: function () {
			return customerId;
		},
		setCustomerId: function(value) {
			customerId = value;
		},
		getTransactionLogs: function () {
			return transactionLogs;
		},
		setTransactionLogs: function(value) {
			transactionLogs = value;
		},
		getCustomer: function () {
			return customer;
		},
		setCustomer: function(value) {
			customer = value;
		}
	};
});

/* Controllers */

app.controller('AlertsCtrl', ['$scope', 'SharedProperties', AlertsCtrl]);

function AlertsCtrl($scope, SharedProperties) {
	
	console.log("Inside AlertsCtrl...");
	$scope.alerts = [];
	
	var wsUri = "ws://USHYDJCK1.us.deloitte.com:9003";
	websocketAlertCD = new WebSocket(wsUri); 
	websocketAlertCD.onopen = function(evt) { onOpen(evt) }; 
	websocketAlertCD.onclose = function(evt) { onClose(evt) }; 
	websocketAlertCD.onmessage = function(evt) { onMessage(evt) }; 
	websocketAlertCD.onerror = function(evt) { onError(evt) }; 
		
	function onOpen(evt) {
	}  
	
	function onClose(evt) { 
	}  
	
	function onMessage(evt) {
		$scope.$apply(function() {
			var inputMessage = JSON.parse(evt.data);
			$scope.alerts.push(inputMessage);			
		});
	}  
	
	function onError(evt) {
	}  
	
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };	
}

app.controller('BillCtrl', ['$scope', '$rootScope', '$window', 'SharedProperties', BillCtrl]);

function BillCtrl($scope, $rootScope, $window, SharedProperties) {
	
	console.log("Inside BillCtrl...");
	$scope.billItems = [];
	$scope.billAmount = 0.0;
	$scope.billDate = new Date();
	$scope.cartId='';
	
	$scope.transactionLogs = [];
	$scope.customer=[];	
	$scope.customerId=[];
	
	var wsUri = "ws://USHYDJCK1.us.deloitte.com:9002";
	websocketBill = new WebSocket(wsUri); 
	websocketBill.onopen = function(evt) { onOpen(evt) }; 
	websocketBill.onclose = function(evt) { onClose(evt) }; 
	websocketBill.onmessage = function(evt) { onMessage(evt) }; 
	websocketBill.onerror = function(evt) { onError(evt) }; 
		
	function onOpen(evt) { 
	}  
	
	function onClose(evt) { 
		//writeToScreen("DISCONNECTED"); 
	}  
	
	function onMessage(evt) {
		console.log("Inside on message of BillCtrl...");
		$scope.$apply(function() {
			var inputMessage = JSON.parse(evt.data);
			
			if(inputMessage.billItems!=null) {
				$scope.billItems=inputMessage.billItems;
				$scope.billAmount=inputMessage.billAmount;
				$scope.billDate=inputMessage.billDate;
				$scope.cartId=inputMessage.cartId;
			}
			else if(inputMessage.bills!=null) {
				$scope.transactionLogs=inputMessage.bills;
				SharedProperties.setTransactionLogs(inputMessage.bills);
				$rootScope.$emit('TransactionEvent');
			}
			else if(inputMessage.customerName!=null) {
				$scope.customer=inputMessage;
				SharedProperties.setCustomerId(inputMessage);
				$scope.customerId=inputMessage.customerId;
				SharedProperties.setCustomer(inputMessage);
				$rootScope.$emit('TopRibbonEvent');
			}
		});
		//writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>'); 
		//websocketBill.close(); 
	}  
	
	function onError(evt) {
		//writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data); 
	}  
	
	function doSend(message) { 
		websocketBill.send(message); 
	}

	
	$scope.signOut=function() {
		var signOutMsg = { userAction:'SignOut', customerId:$scope.customerId, additionalInfo:$scope.cartId };
		websocketBill.send(JSON.stringify(signOutMsg));
		//websocketBill.close();
		$window.location("http://USHYDJCK1.us.deloitte.com:9001");
	};
	
}

app.controller('TopRibbonCtrl', ['$scope', '$rootScope', 'SharedProperties', TopRibbonCtrl]);

function TopRibbonCtrl($scope, $rootScope, SharedProperties) {
	$scope.customer = [];
	
	$rootScope.$on('TopRibbonEvent', function() {
		console.log('TopRibbonEvent Handler ...');
		//$scope.$apply(function() {
			$scope.customer=SharedProperties.getCustomer();
		//});
	});
}

app.controller('TransactionCtrl', ['$scope', '$rootScope', 'SharedProperties', TransactionCtrl]);

function TransactionCtrl($scope, $rootScope, SharedProperties) {
	$scope.transactionLogs = [];
	
	$rootScope.$on('TransactionEvent', function() {
		console.log('TransactionEvent Handler ...');
		//$scope.$apply(function() {
			$scope.transactionLogs=SharedProperties.getTransactionLogs();
		//});
	});
}

/* Carousel Controller */
/* function CarouselDemoCtrl($scope){
  $scope.myInterval = 3000;
  $scope.slides = [
    {
      image: 'http://lorempixel.com/400/200/'
    },
    {
      image: 'http://lorempixel.com/400/200/food'
    },
    {
      image: 'http://lorempixel.com/400/200/sports'
    },
    {
      image: 'http://lorempixel.com/400/200/people'
    }
  ];

} */

/*app.factory('socket', function($rootScope) {
	var socket = io.connect();
	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		}
	};
});*/