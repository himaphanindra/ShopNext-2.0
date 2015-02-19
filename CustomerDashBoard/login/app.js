var customer1 = [];
	customer1.push({Username:'Jack',CustomerId:12345});	
	customer1.push({Username:'Subhadip',CustomerId:12346});
	customer1.push({Username:'Phani',CustomerId:12347});
	customer1.push({Username:'Bharat',CustomerId:12348});
	customer1.push({Username:'Tushar',CustomerId:12349});
		
function myFunction(f){
	var user = document.getElementById('Username').value;
	var i1 = 'http://USHYDJCK1.us.deloitte.com:9001/CustomerId=';
	var finalId = '';
	for(i=0;i<=customer1.length;i++){
		if(user==customer1[i].Username){
			finalId = customer1[i].CustomerId;
			break;
		}
	}
	f.action = i1 + finalId;
	return true;
}

$(document).ready(function() {
	/* Tabs Activiation */
	var tabs = $('ul.tabs'),
	    tabsContent = $('ul.tabs-content');
	tabs.each(function(i) {
		//Get all tabs
		var tab = $(this).find('> li > a');
		tab.click(function(e) {
			//Get Location of tab's content
			var contentLocation = $(this).attr('href') + "Tab";
			//Let go if not a hashed one
			if(contentLocation.charAt(0)=="#") {
				e.preventDefault();
				//Make Tab Active
				tab.removeClass('active');
				$(this).addClass('active');
				//Show Tab Content
				$(contentLocation).show().siblings().hide();
			} 
		});
	}); 
	
});