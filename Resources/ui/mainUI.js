exports._get = function(params) {

    var views=[];   
    this.i=1;
    
    Ti.API.debug("GLEB - Creating Window="+params.name);
    Ti.API.debug("GLEB - defaultView="+params.defaultView|| 0);
    //Ti.API.debug('GLEB - DATOS DEL JSON: ' + JSON.stringify(params));
    
    for(v in params.views) {
        if( params.views[v].contentType =='grid' ){
			if(require("modules/glebData").validateView(params.views[v], 'grid')){        	
	            var GlebGridView = require('ui/views/gridView');                
	            var view = new GlebGridView({
	                name: params.views[v].name || "",
	                refresh: params.views[v].refresh || "OFF",
	                style: params.views[v].style || {},
	                content: params.views[v].content      
	            });
	            views.push(view);
            }
        }
        else if( params.views[v].contentType =='market' ){
			if(require("modules/glebData").validateView(params.views[v], 'market')){        	
	            var GlebMarketView = require('ui/views/marketView');            
	            var view = new GlebMarketView({
	                name: params.views[v].name || "",
	                refresh: params.views[v].refresh || "OFF",
	                style: params.views[v].style || {},
	                content: params.views[v].content
	            });
	            views.push(view);
            }
        }
        else if( params.views[v].contentType =='listMarket' ){
			if(require("modules/glebData").validateView(params.views[v], 'listMarket')){        	
	            var GlebListMarketView = require('ui/views/listMarketView');            
	            var view = new GlebListMarketView({
	                name: params.views[v].name || "",
	                refresh: params.views[v].refresh || "OFF",
	                headerTitle: params.views[v].headerTitle || "",
	                style: params.views[v].style || {},
	                content: params.views[v].content
	            });
	            views.push(view);
            }
        }
        else if(params.views[v].contentType =='grid_3' ){
			if(require("modules/glebData").validateView(params.views[v], 'grid_3')){        	
	            var GlebGridView3 = require('ui/views/grid3View');            
	            var view = new GlebGridView3({
	                name: params.views[v].name || "",
	                refresh: params.views[v].refresh || "OFF",
	                style: params.views[v].style || {},
	                content: params.views[v].content
	            });
	            views.push(view);
            }
        }
        else if(params.views[v].contentType =='list' ){
			if(require("modules/glebData").validateView(params.views[v], 'list')){        	
	            var GlebListView = require('ui/views/listView');            
	            var view = new GlebListView({
	                name: params.views[v].name || "",
	                refresh: params.views[v].refresh || "OFF",
	                headerTitle: params.views[v].headerTitle || "",
	                style: params.views[v].style || {},
	                content: params.views[v].content
	            });
	            views.push(view);
            }
        }
        else if(params.views[v].contentType =='form' ){
			if(require("modules/glebData").validateView(params.views[v], 'form')){
	            var FormView = require('ui/views/formView');            
	            var view = new FormView({
	                name: params.views[v].name || "",
	                refresh: params.views[v].refresh || "OFF",
	                headerTitle: params.views[v].headerTitle || "",
	                style: params.views[v].style || {},
	                content: params.views[v].content
	            });
	            views.push(view);
            }
        }
        else if(params.views[v].contentType =='mapView' ){      
			if(require("modules/glebData").validateView(params.views[v], 'mapView')){    
	            var GlebMapView = require('ui/views/mapView');
	            var view = new GlebMapView({
	                headerTitle: params.views[v].headerTitle || "",
	                showTrack: params.views[v].showTrack || "OFF",
	                content: params.views[v].content         
	            });
	            views.push(view);
            }
        }
        else if(params.views[v].contentType =='webView' ){      
            if(require("modules/glebData").validateView(params.views[v], 'webView')){
            	var GlebWebView = require('ui/views/webView');
	            var view = new GlebWebView({
	                name: params.views[v].name || "",
	                url: params.views[v].url      
	            });
	            views.push(view);
            }
        }
        else {
            Ti.API.info("Type unsupported="+params.views[v].contentType);
            //var view = new GlebView(params.views[v]);
            //this.views.push(view);
        }
    };
    
    //CLEAN ALL REQUIRES
    GlebGridView = null;
    GlebMarketView = null;
    GlebListMarketView = null;
    GlebGridView3 = null;
    GlebListView = null;
    FormView = null;
    GlebWebView = null;
    
    
	var mainView = Titanium.UI.createScrollableView({
		views: views, // scrollViews que componen el scrollview
		backgroundImage: 'transparent',
		showPagingControl: false,
		maxZoomScale: 2.0,
		width: Ti.UI.FILL, //Nuevo de la version 2.0
		currentPage:  params.defaultView || 0,
		top: Ti.App.glebUtils._p(46),
	});

	var gleb_mainViewTo_f = function (e){
	    /*
		var i;
    	Ti.API.debug("GLEB - MAIN WINDOW - Numero de vistas: " + mainView.views.length);
		Ti.API.debug("GLEB - MAIN WINDOW - Buscamos la vista con nombre: " + e.source.eventParams);
		for (i=0; i< mainView.views.length ; i++){
			Ti.API.debug("GLEB - MAIN WINDOW - " + e.source.eventParams + " : " + mainView.views[i].eventParams);
			if (mainView.views[i].name == e.source.eventParams) break;
		}
		*/
		Ti.API.info("GLEB - MAIN WINDOW - Movemos scrollable view to:"+JSON.stringify(e));		
		mainView.currentPage=parseInt(e.view);
	};
	Ti.App.addEventListener ('gleb_mainViewTo', gleb_mainViewTo_f);

	mainView.moveTo = function (e){
        var i;
        Ti.API.debug("GLEB - MAIN WINDOW - Numero de vistas: " + mainView.views.length);
        Ti.API.debug("GLEB - MAIN WINDOW - Buscamos la vista con nombre: " + e.source.eventParams);
        for (i=0; i< mainView.views.length ; i++){
            Ti.API.debug("GLEB - MAIN WINDOW - " + e.source.eventParams + " : " + mainView.views[i].eventParams);
            if (mainView.views[i].name == e.source.eventParams) break;
        }
        Ti.API.info("GLEB - MAIN WINDOW - Movemos scrollable view to:"+i);
        mainView.currentPage=i;
    };

	return mainView;
};