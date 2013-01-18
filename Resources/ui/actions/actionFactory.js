/*
 * Add actions to the items of the JSON
*/

//Cargamos el módulo que contiene todos los métodos personalizados solicitados por el cliente
var customMethods = require ("modules/customMethods");

exports.addAction = function(element, data) {
																	
	if (data.action == 'openWebView') {
		element.addEventListener('click', function(e){
			Titanium.Media.vibrate([ 0, 100]);
			var win = require ("modules/controlWindow").createWindow();
			win.title = "WebView";
			win.modal = true;
			var webview = Titanium.UI.createWebView({url:data.url});
    		win.add(webview);
    		win.open();
		});
		Ti.API.debug("GLEB - openWebView:"+data.url);
	}   
	
	else if (data.action == 'openWin') {
		element.addEventListener('click', function(e){
			Titanium.Media.vibrate([ 0, 100]);
			var win = require ("modules/controlWindow").createWindow();
			win.modal = true;
			
			var GlebListView = require('ui/views/listView');
			var view = new GlebListView({
				name: data.winContent.name,
				headerTitle: data.winContent.headerTitle,
				style: data.winContent.style,
			    data: data.winContent.content
			});
    		
    		win.add(view);
    		win.open();
		});
	}
	
	else if (data.action == 'execMethod') {
		element.addEventListener('click', function(e){
			Titanium.Media.vibrate([ 0, 100]);
			eval ("customMethods."+data.method+"(data.methodParams)");
		});
		Ti.API.debug("GLEB - raising custom method:"+data.method);
	}	
			
	else {
		//Si la acción indicada no es ninguna de las permitidas, no hacemos nada
	}	   								
};