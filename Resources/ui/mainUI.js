var globalView;

exports._get = function(params) {

	globalView = Titanium.UI.createView();
	var statusBar = require('ui/statusBar');

	var views=[];	
	this.i=1;
	
	Ti.API.debug("GLEB - Creating Window="+params.name);
	Ti.API.debug("GLEB - defaultView="+params.defaultView|| 0);
	Ti.API.debug('GLEB - DATOS DEL JSON: ' + JSON.stringify(params));
	
	for(v in params.views) {
		if( params.views[v].contentType =='grid' ){
			var GlebGridView = require('ui/views/gridView');
			var view = new GlebGridView({
			    data: params.views[v].content,
			    style: params.views[v].style,	
   			    name: params.views[v].name,		    
			});
			views.push(view);
			GlebGridView = null;
		}
		else if( params.views[v].contentType =='market' ){
			var GlebMarketView = require('ui/views/marketView');
			var view = new GlebMarketView({
			    data: params.views[v].content,
			    style: params.views[v].style,
			    name: params.views[v].name,
			});
			views.push(view);
			GlebMarketView = null;
		}
		else if( params.views[v].contentType =='listMarket' ){
			var GlebListMarketView = require('ui/views/listMarketView');
			var view = new GlebListMarketView({
			    data: params.views[v].content,
			    style: params.views[v].style,
			    headerTitle: params.views[v].headerTitle,
			    footerTitle: params.views[v].footerTitle,
   			    name: params.views[v].name,
			});
			//INTENTS////////////////////
			Ti.API.debug('GLEB - DATOS DEL VIEW: ' + JSON.stringify(view));
			Ti.API.debug('GLEB - NOMBRE DEL VIEW: ' + view.name);
			if(view.name == 'listaOTs'){
				view.addEventListener('longclick', function(e) {
				    Ti.API.debug('GLEB - LONG CLICK SOBRE LIST PARA LANZAR INTENT: ' + JSON.stringify(e));
				    var intent = Ti.Android.createIntent({
				        action: Ti.Android.ACTION_SEND,
				        type: "text/plain"
				    });
				 
					//No siempre el texto a compartir viene en el mismo sitio
					var text = ( e.source.children[0].text ) ? e.source.children[0].text : 'TEXTO POR DEFECTO';
					var text2 = ( e.source.children[1].text ) ? e.source.children[1].text : 'TEXTO POR DEFECTO';
					var fullText = text + text2;
				    intent.putExtra(Ti.Android.EXTRA_TEXT, fullText);
				    intent.addCategory(Ti.Android.CATEGORY_DEFAULT);
				    Ti.Android.currentActivity.startActivity(intent);
				});
			}
			//////////////////////////////
			views.push(view);
			GlebListMarketView = null;
		}
		else if(params.views[v].contentType =='grid_3' ){
			var GlebGridView3 = require('ui/views/grid3View');
			var view = new GlebGridView3({
			    data: params.views[v].content,
			    style: params.views[v].style,
   			    name: params.views[v].name,
			});
			views.push(view);
			GlebGridView3 = null;
		}
		else if(params.views[v].contentType =='list' ){
			var GlebListView = require('ui/views/listView');
			var view = new GlebListView({
			    data: params.views[v].content,
			    style: params.views[v].style,
			    headerTitle: params.views[v].headerTitle,
			    footerTitle: params.views[v].footerTitle,
   			    name: params.views[v].name,
			});
			//INTENTS////////////////////
			Ti.API.debug('GLEB - DATOS DEL VIEW: ' + JSON.stringify(view));
			Ti.API.debug('GLEB - NOMBRE DEL VIEW: ' + view.name);
			if(view.name == 'listaTecnicos'){
				view.addEventListener('longclick', function(e) {
				    Ti.API.debug('GLEB - LONG CLICK SOBRE LIST PARA LANZAR INTENT: ' + JSON.stringify(e));
				    var intent = Ti.Android.createIntent({
				        action: Ti.Android.ACTION_SEND,
				        type: "text/plain"
				    });
				 
					//No siempre el texto a compartir viene en el mismo sitio
					var text = ( e.source.children[1].text.text ) ? e.source.children[1].text.text : 'TEXTO POR DEFECTO';
				    intent.putExtra(Ti.Android.EXTRA_TEXT, text);
				    intent.addCategory(Ti.Android.CATEGORY_DEFAULT);
				    Ti.Android.currentActivity.startActivity(intent);
				});
			}
			//////////////////////////////
			views.push(view);
			GlebListView = null;
		}
		else if(params.views[v].contentType =='form' ){
			var FormView = require('ui/views/formView');
			Ti.API.debug("GLEB - FORM_VIEW"+ JSON.stringify(params.views[v]));
			var view = new FormView({
			    data: params.views[v].content,
			    style: params.views[v].style,
   			    name: params.views[v].name,
   			    headerTitle: params.views[v].headerTitle
			});
			views.push(view);
			FormView = null;
		}
		else if(params.views[v].contentType =='webView' ){
			var GlebWebView = require('ui/views/webView');			
			Ti.API.info("GLEB - WEBVIEW URL"+ JSON.stringify(params.views[v]));			
			var view = new GlebWebView({
			    url: params.views[v].url,			    
   			    name: params.views[v].name,
			});
			views.push(view);
			GlebWebView = null;
		}
		
		else {
			Ti.API.info("Type unsupported="+params.views[v].contentType);
			//var view = new GlebView(params.views[v]);
			//this.views.push(view);
		}
	};
		
	var mainView = Titanium.UI.createScrollableView({
		views: views, // scrollViews que componen el scrollview
		backgroundImage: 'transparent',
		showPagingControl: true,
		maxZoomScale:2.0,
		width: Ti.UI.FILL, //Nuevo de la version 2.0 
		currentPage:  params.defaultView|| 0,
		top: Ti.App.glebUtils._p(46),
	});	
	
	mainView.addEventListener('scroll', function(e) {		
		Titanium.API.debug("scroll called - current index " + e.source.currentPage + ' active view ' + e.source.views[e.currentPage].name);
	});
	
	
	var gleb_mainViewTo_f = function (e){		
		var i;		
    	Ti.API.info("GLEB - Numero de vistas:"+mainView.views.length);
		Ti.API.info("GLEB - Buscamos la vista con nombre :"+e.source.eventParams);
		for (i=0; i< mainView.views.length ; i++){
			Ti.API.info("GLEB - "+e.source.eventParams+":"+mainView.views[i].eventParams);
			if (mainView.views[i].name == e.source.eventParams) break; 			
		}
		Ti.API.info("GLEB - Movemos scrollable view to:"+i);
		mainView.currentPage=i;		
	};	
	Ti.App.addEventListener ('gleb_mainViewTo', gleb_mainViewTo_f);
    
   
	globalView.add(statusBar.statusBar());
	globalView.add(mainView);
	
	return globalView;
};