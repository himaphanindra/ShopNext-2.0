(function(){ 
angular.module('Dashboard', ['ui.bootstrap', 'ui.router', 'ngCookies']);
'use strict';

/**
 * Route configuration for the Dashboard module.
 */
angular.module('Dashboard').config(['$stateProvider', '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider) {

    // For unmatched routes
    $urlRouterProvider.otherwise('/');

    // Application routes
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'dashboard.html'
        })
        .state('tables', {
            url: '/tables', 
            templateUrl: 'tables.html'
        });
}]);

/**
 * HeatMap Controller
 */
angular.module('Dashboard')
    .controller('HeatMapCtrl', ['$scope', HeatMapCtrl]);

function HeatMapCtrl($scope) {
	$scope.totalCustomersOnFloor = 0;
	$scope.totalCustomersInSection1 = 0;
	$scope.totalCustomersInSection2 = 0;
	$scope.totalCustomersInSection3 = 0;
	
	var wsUri = "ws://USHYDJCK1.us.deloitte.com:8006";
	websocketHeatMap = new WebSocket(wsUri); 
	websocketHeatMap.onopen = function(evt) { onOpen(evt) }; 
	websocketHeatMap.onclose = function(evt) { onClose(evt) }; 
	websocketHeatMap.onmessage = function(evt) { onMessage(evt) }; 
	websocketHeatMap.onerror = function(evt) { onError(evt) }; 
		
	function onOpen(evt) { 
	}  
	
	function onClose(evt) { 
	}  
	
	function onMessage(evt) {
		$scope.$apply(function() {
			$scope.totalCustomersOnFloor = (JSON.parse(evt.data).totalCustomersOnFloor);
			$scope.totalCustomersInSection1 = (JSON.parse(evt.data).totalCustomersInSection1);
			$scope.totalCustomersInSection2 = (JSON.parse(evt.data).totalCustomersInSection2);
			$scope.totalCustomersInSection3 = (JSON.parse(evt.data).totalCustomersInSection3);
		});
		console.log("\n\n\nJSON Message: \n\n%s\n\n", JSON.parse(evt.data));
	}  
	
	function onError(evt) {
	}  
	
	function doSend(message) { 
	}  	
}

/**
 * Alerts Controller
 */
angular.module('Dashboard').controller('AlertsCtrl', ['$scope', AlertsCtrl]);

function AlertsCtrl($scope) {
	
	$scope.alerts = [];
	
	var wsUri = "ws://USHYDJCK1.us.deloitte.com:8002";
	websocketAlert = new WebSocket(wsUri); 
	websocketAlert.onopen = function(evt) { onOpen(evt) }; 
	websocketAlert.onclose = function(evt) { onClose(evt) }; 
	websocketAlert.onmessage = function(evt) { onMessage(evt) }; 
	websocketAlert.onerror = function(evt) { onError(evt) }; 
		
	function onOpen(evt) { 
		//writeToScreen("CONNECTED"); 
		//doSend("websocketAlert rocks"); 
	}  
	
	function onClose(evt) { 
		//writeToScreen("DISCONNECTED"); 
	}  
	
	function onMessage(evt) {
		$scope.$apply(function() {
			$scope.alerts.push(JSON.parse(evt.data));
		});
		//writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>'); 
		//websocketAlert.close(); 
	}  
	
	function onError(evt) {
		//writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data); 
	}  
	
	function doSend(message) { 
		//writeToScreen("SENT: " + message);  
		//websocketAlert.send(message); 
	}  
	
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };	
}

/**
 * Top Spenders Controller
 */
angular.module('Dashboard').controller('SpendersCtrl', ['$scope', SpendersCtrl]);

function SpendersCtrl($scope) {
	$scope.topBuyerList = [];
	
	var wsUri = "ws://USHYDJCK1.us.deloitte.com:8003";
	websocketSpender = new WebSocket(wsUri); 
	websocketSpender.onopen = function(evt) { onOpen(evt) }; 
	websocketSpender.onclose = function(evt) { onClose(evt) }; 
	websocketSpender.onmessage = function(evt) { onMessage(evt) }; 
	websocketSpender.onerror = function(evt) { onError(evt) }; 
		
	function onOpen(evt) { 
		//writeToScreen("CONNECTED"); 
		//doSend("WebSocket rocks"); 
	}  
	
	function onClose(evt) { 
		//writeToScreen("DISCONNECTED"); 
	}  
	
	function onMessage(evt) {
		$scope.$apply(function() {
			$scope.topBuyerList = (JSON.parse(evt.data).topBuyer);
		});
		console.log("\n\n\nJSON Message: \n\n%s\n\n", $scope.topBuyerList);
		//writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>'); 
		//websocketSpender.close(); 
	}  
	
	function onError(evt) {
		//writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data); 
	}  
	
	function doSend(message) { 
		//writeToScreen("SENT: " + message);  
		//websocketSpender.send(message); 
	}  
	
}

/**
 * Most Sold Products Controller
 */
angular.module('Dashboard').controller('MostSoldCtrl', ['$scope', 'limitToFilter', MostSoldCtrl]);

function MostSoldCtrl($scope, limitToFilter) {
		
	$scope.mostSoldList = [];	
	$scope.limitedMostSoldList = [];
	$scope.mostSoldUpdated = {
								mostSoldCategory: [	
													{name: 'Hardware & Tools', y: 33.33, color: '#058DC7'}, 
													{name: 'Groceries', y: 33.33, color: '#50B432'},
													{name: 'Kithcen & Appliances', y: 33.33, color: '#ED561B'}
												],
								mostSoldItems: [
													{name: 'Paint kit', y: 11.11, color: '#058DC7'}, 
													{name: 'Chain Saw', y: 11.11, color: '#058DC7'}, 
													{name: 'Hardware Toolkit', y: 11.11, color: '#058DC7'}, 
													{name: 'Fresh Bread', y: 11.11, color: '#50B432'}, 
													{name: 'Butter 50gms', y: 11.11, color: '#50B432'}, 
													{name: 'Fruit Jam 100gms', y: 11.11, color: '#50B432'}, 
													{name: 'DineWare Set', y: 11.11, color: '#ED561B'}, 
													{name: 'Knife Set', y: 11.11, color: '#ED561B'}, 
													{name: 'Mixer Grinder', y: 11.11, color: '#ED561B'}													
												]
							};
	
	var wsUri = "ws://USHYDJCK1.us.deloitte.com:8004";
	websocketMostSold = new WebSocket(wsUri); 
	websocketMostSold.onopen = function(evt) { onOpen(evt) }; 
	websocketMostSold.onclose = function(evt) { onClose(evt) }; 
	websocketMostSold.onmessage = function(evt) { onMessage(evt) }; 
	websocketMostSold.onerror = function(evt) { onError(evt) }; 
	
	function onOpen(evt) {  
	}  
	
	function onClose(evt) {
	}  
	
	function onMessage(evt) {
		$scope.$apply(function() {
			$scope.mostSoldList = (JSON.parse(evt.data).topSellingItem);
			$scope.limitedMostSoldList = limitToFilter($scope.mostSoldList, 5);
			
			var paint = 0;
			var chain = 0;
			var hardware = 0;
			var bread = 0;
			var butter = 0;
			var fruit = 0;
			var dineware = 0;
			var knife = 0;
			var mixer = 0;
			
			for(i = 0; i < $scope.mostSoldList.length; i++) { 
				switch($scope.mostSoldList[i].itemName) {
					case 'Paint kit': 
						paint=$scope.mostSoldList[i].totalSalesQty; 
						break;
						
					case 'Chain Saw': 
						chain=$scope.mostSoldList[i].totalSalesQty; 
						break;
					
					case 'Hardware Toolkit': 
						hardware=$scope.mostSoldList[i].totalSalesQty; 
						break;
						
					case 'Fresh Bread': 
						bread=$scope.mostSoldList[i].totalSalesQty; 
						break;
						
					case 'Butter 50gms': 
						butter=$scope.mostSoldList[i].totalSalesQty; 
						break;
					
					case 'Fruit Jam 100gms': 
						fruit=$scope.mostSoldList[i].totalSalesQty; 
						break;
						
					case 'DineWare Set': 
						dineware=$scope.mostSoldList[i].totalSalesQty; 
						break;
						
					case 'Knife Set': 
						knife=$scope.mostSoldList[i].totalSalesQty; 
						break;
					
					case 'Mixer Grinder': 
						mixer=$scope.mostSoldList[i].totalSalesQty; 
						break;
				}
			}
			
			totalSales=paint+chain+hardware+bread+butter+fruit+dineware+knife+mixer;
			
			$scope.mostSoldUpdated = {
										mostSoldCategory: [	
															{name: 'Hardware & Tools', y: (paint+chain+hardware)*100/totalSales, color: '#058DC7'}, 
															{name: 'Groceries', y: (bread+butter+fruit)*100/totalSales, color: '#50B432'},
															{name: 'Kithcen & Appliances', y: (dineware+knife+mixer)*100/totalSales, color: '#ED561B'}
														],
										mostSoldItems: [
															{name: 'Paint kit', y: (paint)*100/totalSales, color: '#058DC7'}, 
															{name: 'Chain Saw', y: (chain)*100/totalSales, color: '#058DC7'}, 
															{name: 'Hardware Toolkit', y: (hardware)*100/totalSales, color: '#058DC7'}, 
															{name: 'Fresh Bread', y: (bread)*100/totalSales, color: '#50B432'}, 
															{name: 'Butter 50gms', y: (butter)*100/totalSales, color: '#50B432'}, 
															{name: 'Fruit Jam 100gms', y: (fruit)*100/totalSales, color: '#50B432'}, 
															{name: 'DineWare Set', y: (dineware)*100/totalSales, color: '#ED561B'}, 
															{name: 'Knife Set', y: (knife)*100/totalSales, color: '#ED561B'}, 
															{name: 'Mixer Grinder', y: (mixer)*100/totalSales, color: '#ED561B'}													
														]
									};
		});
		console.log("\n\nJSON Message: \n\n%s\n\n", $scope.mostSoldList);	
		console.log("\n\nJSON Message: \n\n%s\n\n", $scope.mostSoldUpdated);
	}
	
	function onError(evt) {
	}  
	
	function doSend(message) { 
	}
}

angular.module('Dashboard').directive('hcPie', function () {
	return {
		restrict: 'C',
		
		replace: true,
		
		scope: {
			items: '='
		},
		
		controller: function ($scope, $element, $attrs) {
			console.log(2);
		},
 
		template: '<div id="container" style="margin: 0 auto">not working</div>',
		
		link: function (scope, element, attrs) {
			console.log(3);
			var chart = new Highcharts.Chart({
				chart: {
					renderTo: 'container',
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false
				},
				
				title: {
					text: null
				},
				
				tooltip: {
					pointFormat: '<b>{series.name}: </b>{point.name}<br\><b>Total Sales Percentage: </b>{point.percentage}%',
					percentageDecimals: 1
				},
				
				plotOptions: {
					pie: {
							allowPointSelect: true,
							cursor: 'pointer'
						}
					},
				
				series: [{
							type: 'pie',
							name: 'Item Category',
							size: '60%',
							data: scope.items,
							dataLabels: {
								enabled: false
							},
							showInLegend: true
						},
						{
							type: 'pie',
							name: 'Item Name',
							size: '80%',
							innerSize: '60%',
							data: scope.items,
							dataLabels: {
								enabled: true,
								formatter: function () {
									return '<b>'+this.point.name+'</b>';
								}
							}
						}]
			});
			
			scope.$watch("items", function (newValue) {
				chart.series[0].setData(newValue.mostSoldCategory, true);
				chart.series[1].setData(newValue.mostSoldItems, true);
			}, true);		
      
		}
	}
});

/**
 * Products Low in Stock Controller
 */
angular.module('Dashboard').controller('ProductsLowStockCtrl', ['$scope', ProductsLowStockCtrl]);

function ProductsLowStockCtrl($scope) {
	$scope.itemsLowInStock = [];
	$scope.items = [];
			
	var wsUri = "ws://USHYDJCK1.us.deloitte.com:8005";
	websocketProductsLow = new WebSocket(wsUri); 
	websocketProductsLow.onopen = function(evt) { onOpen(evt) }; 
	websocketProductsLow.onclose = function(evt) { onClose(evt) }; 
	websocketProductsLow.onmessage = function(evt) { onMessage(evt) }; 
	websocketProductsLow.onerror = function(evt) { onError(evt) }; 
	
	function onOpen(evt) {  
	}  
	
	function onClose(evt) {
	}  
	
	function onMessage(evt) {
		$scope.$apply(function() {
			$scope.itemsLowInStock = (JSON.parse(evt.data).itemLowInStock);
		});	
		
		console.log("\n\n\nJSON Message: \n\n%s\n\n", $scope.itemsLowInStock);
		$scope.items = [];
		var totalKeys = Object.keys($scope.itemsLowInStock);
		
		for(var i=0; i<totalKeys.length; i++) {
			var itemLowInStock = $scope.itemsLowInStock[totalKeys[i]];
			var itemToPush = {name: itemLowInStock[1], y: itemLowInStock[2]*1};
			$scope.items.push(itemToPush);
		}
		console.log("\n\nTransformed Message: \n\n%s\n\n", JSON.stringify($scope.items));
		lowItemChart.series[0].setData($scope.items);
		lowItemChart.redraw();
	}  
	
	function onError(evt) {
	}  
	
	function doSend(message) { 
	}  
	
	chartOptions = {
		chart: {
			renderTo: 'columnChart',
			type: 'column',
		},
		title: {
			text: null
		},
		subtitle: {
			text: null
		},
		xAxis: {
			categories: [
				'Items'
			]
		},
		yAxis: {
			min: 0,
			title: {
				text: 'Current Stock'
			}
		},
		tooltip: {
			headerFormat: '<table>',
			pointFormat: '<tr><td style="color:{series.color};padding:0">{point.name}: </td>' +
						'<td style="padding:0"><b>{point.y} Items Left</b></td></tr>',
			footerFormat: '</table>',
			shared: true,
			useHTML: true
		},
		plotOptions: {
			column: {
				pointPadding: 0.46,
				borderWidth: 0
			}
		},
		series: [{
			name: 'Inventory Items',
			data: $scope.items
		}]
	};

	lowItemChart = new Highcharts.Chart(chartOptions);
}

/**
 * Loading Directive
 * @see http://tobiasahlin.com/spinkit/
 */
angular.module('Dashboard').directive('rdLoading', rdLoading);

function rdLoading () {
    var directive = {
        restrict: 'AE',
        template: '<div class="loading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
    };
    return directive;
};
})();