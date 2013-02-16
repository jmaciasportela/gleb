/**
* @version 0.1
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

module.exports = function(){  

Ti.API.info('GLEB - Cargando banner View');
	// create UI components
	var view = Ti.UI.createView({		
		backgroundImage: '../../images/statusBar.png',
		height: '40dp',		
		touchEnabled: true,
		borderRadius: 0
	});

	var banner = Ti.UI.createImageView({
		top: '5dp',
		left: '120dp',
		width: '80dp',
		height: '30dp',
  		image: '../../images/banner.png'
	});

	/*
    banner.addEventListener('click',function(){
		var win = Ti.UI.createWindow();
		var webview = Ti.UI.createWebView({
    		url: 'http://www.appcelerator.com'    	
		});
		win.add(webview);
		require('modules/NavigationController').open(win);
    });
	*/
	
    view.add(banner);
			
	Ti.API.info('GLEB - Elementos añadidos a la vista');
	
	

return view;
}
