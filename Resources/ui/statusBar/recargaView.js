//StatusBar Constructor

exports._get = function() {
	
////var utils = require("global_functions");

Ti.API.info('GLEB - Cargando msgView View');
	// create UI components
	var view = Ti.UI.createView({		
		backgroundImage: '../../images/statusBar_left.png',
		height: Ti.App.glebUtils._p(40),		
		touchEnabled: true,
		borderRadius: 0
	});

	var recarga = Titanium.UI.createButton({   		
   		top: Ti.App.glebUtils._p(4),
   		title: "RECARGA UI",   		
   		left: Ti.App.glebUtils._p(30),
   		right: Ti.App.glebUtils._p(30),
   		height: Ti.App.glebUtils._p(36),
		});
		recarga.addEventListener('click',function(){	
	   		require("plugins/glebAPI").getMenus();		
		});	
				
	var buttonRight = Titanium.UI.createButton({   		
		backgroundColor: 'transparent',
   		top: '0dp',
   		width: '40dp',
   		height: '40dp',
   		left: '290dp'
		});
		buttonRight.addEventListener('click',function(){require("ui/statusBar").statusBarToRight();});	
		
	// assemble view hierarchy
	view.add(recarga);
	view.add(buttonRight);
		
	Ti.API.info('GLEB - Elementos añadidos a la vista');

return view;
}
