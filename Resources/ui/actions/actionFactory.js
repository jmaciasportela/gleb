/*
 * Add actions to the items of the JSON
*/

//Cargamos el módulo que contiene todos los métodos personalizados solicitados por el cliente
var customMethods = require ("modules/customMethods");

exports.addAction = function(element, data) {
																	
	if (data.action == 'openWebView') {
		element.addEventListener('click', function(e){
			Titanium.Media.vibrate([ 0, 100]);
            var win = new Titanium.UI.createWindow({
                      orientationModes : [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT],
                      backgroundColor:'transparent',
                      navBarHidden: true,
                   });    			
			//var win = require ("modules/controlWindow").createWindow();
			win.title = "WebView";
			win.modal = true;
		
			var webview = Titanium.UI.createWebView({url:data.url, top: Ti.App.glebUtils._p(46)});
	
			//var stbar = require('ui/statusBar');
       		//win.add(new stbar());
    		
    		win.add(webview);
    		require('modules/NavigationController').open(win);  
		});
	}   
	
	else if (data.action == 'openWin') {
		element.addEventListener('click', function(e){
			Titanium.Media.vibrate([ 0, 100]);
            var win = new Titanium.UI.createWindow({
                      orientationModes : [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT],
                      navBarHidden: true,
                   });    			
			//var win = require ("modules/controlWindow").createWindow();
			win.modal = true;			
			var GlebListView = require('ui/views/listView');
			var view = new GlebListView({
				name: data.winContent.name,
				headerTitle: data.winContent.headerTitle,
				style: data.winContent.style,
			    data: data.winContent.content                
			});    		
    		view.setTop(Ti.App.glebUtils._p(46));
    		
    		//var stbar = require('ui/statusBar');
       		//win.add(new stbar());
       		
    		win.add(view);
    		require('modules/NavigationController').open(win);  
		});
	}
	
	else if (data.action == 'execMethod') {
		element.addEventListener('click', function(e){
			Titanium.Media.vibrate([ 0, 100]);
			eval ("customMethods."+data.method+"(data.methodParams)");
		});
	}	
			
	else {
		//Si la acción indicada no es ninguna de las permitidas, no hacemos nada
	}	   								
};