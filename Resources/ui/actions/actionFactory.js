/*
 * Add actions to the items of the JSON
*/

//Cargamos el módulo que contiene todos los métodos personalizados solicitados por el cliente
var customMethods = require ("modules/customMethods");

exports.addAction = function(element, data) {
																	
	if (data.action && data.action == 'openWebView' && data.url && data.url != '') {
		element.addEventListener('click', function(e){
			Titanium.Media.vibrate([ 0, 100]);
            var win = new Titanium.UI.createWindow({
                      orientationModes : [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT],
                      backgroundColor:'transparent',
                      navBarHidden: true,
                   });    			
			win.title = "WebView";
			win.modal = true;
		
			var webview = Titanium.UI.createWebView({url:data.url, top: Ti.App.glebUtils._p(46)});
	
    		win.add(webview);
    		require('modules/NavigationController').open(win);  
		});
	}   
	
	else if (data.action && data.action == 'openWin' && data.winId && data.winId != '') {
		element.addEventListener('click', function(e){
			Titanium.Media.vibrate([ 0, 100]);
            var win = new Titanium.UI.createWindow({
                      orientationModes : [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT],
                      navBarHidden: true,
                   });    			
			win.modal = true;
			
			var typeSupported = false;
			
			//Lo primero será recuperar la información de la ventana que se desea abrir (winId) dentro de la variable winContent
			Ti.API.debug('GLEB - winId: ' + data.winId);
			var winContent = require('modules/glebData').getWinId(data.winId);
			
			if(winContent==null)
			{
				var errorView = Ti.UI.createView({
	                width: Ti.UI.FILL,
	                height: Ti.UI.FILL,                     
	                backgroundColor: 'white',
	                layout: 'vertical'
		        });     
		        
		        var errorLabel = Ti.UI.createLabel({
		            text: 'No se ha podido cargar el contenido de la ventana',
		            color: 'black',
		            font: { fontSize: "16dp"},
		            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		            top: "40dp",
		            right: "10dp",
		            left: "10dp",
		            height:'auto'
		        });     
		        errorView.add(errorLabel);
				errorView.setTop(Ti.App.glebUtils._p(46));
	        	win.add(errorView);
    			require('modules/NavigationController').open(win);
    			return;
			}
			
			switch (winContent.contentType){
		    	case 'grid':
		    		if(require("modules/glebData").validateView(winContent, 'grid')){     
			    		var GlebGridView = require('ui/views/gridView');                
			            var view = new GlebGridView({
			                name: winContent.name || "",
			                refresh: winContent.refresh || "OFF",
			                style: winContent.style || {},
			                content: winContent.content       
			            });
			            typeSupported = true;
					}
		    		break;
		    	case 'market':
		    		if(require("modules/glebData").validateView(winContent, 'market')){ 
			    		var GlebMarketView = require('ui/views/marketView');            
			            var view = new GlebMarketView({
			                name: winContent.name || "",
			                refresh: winContent.refresh || "OFF",
			                style: winContent.style || {},
			                content: winContent.content
			            });
			            typeSupported = true;
					}
		    		break;
		    	case 'listMarket':
		    		if(require("modules/glebData").validateView(winContent, 'listMarket')){ 
				    	var GlebListMarketView = require('ui/views/listMarketView');            
			            var view = new GlebListMarketView({
			                name: winContent.name || "",
			                refresh: winContent.refresh || "OFF",
			                headerTitle: winContent.headerTitle || "",
			                style: winContent.style || {},
			                content: winContent.content
			            });
			    		typeSupported = true;
					}
		    		break;
		    	case 'grid_3':
		    		if(require("modules/glebData").validateView(winContent, 'grid_3')){ 
				    	var GlebGridView3 = require('ui/views/grid3View');            
			            var view = new GlebGridView3({
			                name: winContent.name || "",
			                refresh: winContent.refresh || "OFF",
			                style: winContent.style || {},
			                content: winContent.content
			            });
			    		typeSupported = true;
					}
		    		break;
		    	case 'list':
		    		if(require("modules/glebData").validateView(winContent, 'list')){ 
				    	var GlebListView = require('ui/views/listView');            
			            var view = new GlebListView({
			                name: winContent.name || "",
			                refresh: winContent.refresh || "OFF",
			                headerTitle: winContent.headerTitle || "",
			                style: winContent.style || {},
			                content: winContent.content
			            });
			    		typeSupported = true;
					}
		    		break;
		    	case 'form':
		    		if(require("modules/glebData").validateView(winContent, 'form')){ 
				    	var FormView = require('ui/views/formView');            
			            var view = new FormView({
			                name: winContent.name || "",
			                refresh: winContent.refresh || "OFF",
			                headerTitle: winContent.headerTitle || "",
			                style: winContent.style || {},
			                content: winContent.content
			            });
			    		typeSupported = true;
					}
		    		break;
		    	case 'mapView':
		    		if(require("modules/glebData").validateView(winContent, 'mapView')){ 
				    	var GlebMapView = require('ui/views/mapView');            
			            var view = new GlebMapView({
			                headerTitle: winContent.headerTitle || "",
			                showTrack: winContent.showTrack || "OFF",
			                content: winContent.content
			            });
			    		typeSupported = true;
					}
		    		break;
		    	case 'webView':
		    		if(require("modules/glebData").validateView(winContent, 'webView')){ 
				    	var GlebWebView = require('ui/views/webView');
			            var view = new GlebWebView({
			                name: winContent.name || "",
			                url: winContent.url            
			            });
			    		typeSupported = true;
			    		break;
				}
		    	default:
		    		Ti.API.info("Type unsupported="+winContent.contentType);
		    		break;
	    	}
	        
	        if(typeSupported){
	        	view.setTop(Ti.App.glebUtils._p(46));
	        	win.add(view);
    			require('modules/NavigationController').open(win);
	        }		 
		});
	}

    else if (data.action && data.action == 'openIntent' && data.intent && data.intent != '') {
        element.addEventListener('click', function(e){
            Titanium.Media.vibrate([ 0, 100]);
            customMethods.openIntent(data);
        });
    }
	
	else if (data.action && data.action == 'execMethod' && data.method && data.method != '') {
		element.addEventListener('click', function(e){
			Titanium.Media.vibrate([ 0, 100]);			
			try{
				if(data.methodParams){
			 		eval ("customMethods."+data.method+"(data.methodParams)");
			 	}
			 	else{
			 		eval ("customMethods."+data.method+"()");
			 	}
			}
			catch (err){
			 Ti.API.error("GLEB - Método no encontrado:"+data.method);    
			}
		});
	}	
			
	else {
		//Si la acción indicada no es ninguna de las permitidas, no hacemos nada
	}	   								
};


exports.addShareData = function(element, data) {
	element.addEventListener('longclick', function(){
		var intent = Ti.Android.createIntent({
	        action: Ti.Android.ACTION_SEND,
	        type: "text/plain"
	    });
	 
	    intent.putExtra(Ti.Android.EXTRA_TEXT, data);
	    intent.addCategory(Ti.Android.CATEGORY_DEFAULT);
	    Ti.Android.currentActivity.startActivity(intent);
	});
};