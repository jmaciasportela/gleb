//StatusBar Constructor

exports._get = function() {
	
////var utils = require("global_functions");

Ti.API.info('GLEB - Cargando msgView View');
	// create UI components
	var view = Ti.UI.createView({		
		backgroundImage: '../../images/statusBar.png',
		height: Ti.App.glebUtils._p(40),		
		touchEnabled: true,
		borderRadius: 0
	});

	var showProperties = Titanium.UI.createButton({   		
   		top: Ti.App.glebUtils._p(0),
   		title: "P",
   		width: Ti.App.glebUtils._p(40),
   		height: Ti.App.glebUtils._p(40),
   		left: Ti.App.glebUtils._p(30)
		});
		showProperties.addEventListener('click',function(){	
	   		Ti.App.fireEvent('gleb_openActivityIndicator',{"text":"Cargando ..."});
		
			var config = require('ui/windows/settings/debug').debug();
			config.open();			
		});	

			
	var checkNetwork = Titanium.UI.createButton({   		
   		top: Ti.App.glebUtils._p(0),
   		title: "N",
   		width: Ti.App.glebUtils._p(40),
   		height: Ti.App.glebUtils._p(40),
   		left: Ti.App.glebUtils._p(110)
		});
		checkNetwork.addEventListener('click',function(){
		    Ti.API.info('GLEB - Connection Status:'+ Titanium.Network.online);
		    
		    alert (Titanium.Network.online);

			});				
			
	var showTracking = Titanium.UI.createButton({   		
   		top: Ti.App.glebUtils._p(0),
   		title: "T",
   		width: Ti.App.glebUtils._p(40),
   		height: Ti.App.glebUtils._p(40),
   		left: Ti.App.glebUtils._p(160)
		});
		showTracking.addEventListener('click',function(){

		Ti.API.debug('GLEB - Guardando tracking de posición');
        	var uiDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'tracking');

			var d = new Date;	
			var day=d.getDate();
			var month = d.getMonth();
			var year = d.getYear();
			if (day<= 10){
			   day = "0"+day;
			}
			if (month<= 10){
			   month = "0"+month;
			}
			datestr=day+month+year;
        	var f = Titanium.Filesystem.getFile(uiDir.resolve(), "tracking_"+datestr+".json");
        	if (f.exists()){        		
        		var content = f.read();
        		Ti.API.debug("GLEB - Tracking Content:"+content.text+" size: "+f.size+" bytes");
        	}
        	else {
        		Ti.API.debug("GLEB - No tracking File");	
        	}
		});		
	
	
	var showDB = Titanium.UI.createButton({   		
   		top: Ti.App.glebUtils._p(0),
   		title: "DB",
   		width: Ti.App.glebUtils._p(40),
   		height: Ti.App.glebUtils._p(40),
   		left: Ti.App.glebUtils._p(210)
		});
		showDB.addEventListener('click',function(){
			/*

		Ti.API.debug('GLEB - Guardando tracking de posición');
			var str = '';
			var db = Ti.Database.open('queueHttpBD');
		    var rows = db.execute('SELECT * FROM HTTP_REQUESTS');
		    while (rows.isValidRow()) {
		    	var file = rows.fieldByName('file');
		    	var timestamp = rows.fieldByName('timestamp');
		        var network = rows.fieldByName('network');
		        var counts = rows.fieldByName('counts');
		        var status = rows.fieldByName('status');
		        //str = str + (getfName + ' ' + getlName).replace(/\\n/g, '\n');
		        Ti.API.debug("\n File: "+file+" Timestamp: "+ timestamp+ " Network: "+ network + " COUNTS: "+ counts + " STATUS: "+ status);	        
		        rows.next();
		    }
		    db.close();
		    */
		   
		   require('ui/windows/colaHTTP/colaHTTP').colaHTTP();

		});		
	
	
	var showDB2 = Titanium.UI.createButton({   		
   		top: Ti.App.glebUtils._p(0),
   		title: "DB2",
   		width: Ti.App.glebUtils._p(40),
   		height: Ti.App.glebUtils._p(40),
   		left: Ti.App.glebUtils._p(240)
		});
		showDB2.addEventListener('click',function(){
			

		Ti.API.debug('GLEB - Guardando tracking de posición');
			var str = '';
			var db = Ti.Database.open('queueHttpBD');
		    var rows = db.execute('SELECT * FROM HTTP_REQUESTS');
		    while (rows.isValidRow()) {
		    	var file = rows.fieldByName('file');
		    	var body = rows.fieldByName('body');
		    	var timestamp = rows.fieldByName('timestamp');
		        var network = rows.fieldByName('network');
		        var counts = rows.fieldByName('counts');
		        var status = rows.fieldByName('status');
		        //str = str + (getfName + ' ' + getlName).replace(/\\n/g, '\n');
		        Ti.API.debug("\n Body: "+body+" File: "+file+" Timestamp: "+ timestamp+ " Network: "+ network + " COUNTS: "+ counts + " STATUS: "+ status);	        
		        rows.next();
		    }
		    db.close(); 

		});		
		
		
	var buttonLeft = Titanium.UI.createButton({   		
		backgroundColor: 'transparent',
   		top: '0dp',
   		width: '40dp',
   		height: '40dp',
   		left: '0dp'
		});
		buttonLeft.addEventListener('click',function(){require("ui/statusBar").statusBarToLeft();});	
	
				
	var buttonRight = Titanium.UI.createButton({   		
		backgroundColor: 'transparent',
   		top: '0dp',
   		width: '40dp',
   		height: '40dp',
   		left: '290dp'
		});
		buttonRight.addEventListener('click',function(){require("ui/statusBar").statusBarToRight();});	
		
	// assemble view hierarchy
	view.add(showProperties);
	view.add(checkNetwork);
	view.add(showTracking);
	view.add(showDB);
	view.add(showDB2);
	view.add(buttonLeft);
	view.add(buttonRight);
		
	Ti.API.info('GLEB - Elementos añadidos a la vista');

return view;
}
