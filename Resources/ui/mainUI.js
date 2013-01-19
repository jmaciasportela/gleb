var GlebGridView = require('ui/views/gridView');
var GlebMarketView = require('ui/views/marketView');
var GlebListMarketView = require('ui/views/listMarketView');
var GlebGridView3 = require('ui/views/grid3View');
var GlebListView = require('ui/views/listView');
var FormView = require('ui/views/formView');
var GlebWebView = require('ui/views/webView');  


exports._get = function(params) {

    var views=[];   
    this.i=1;
    
    Ti.API.debug("GLEB - Creating Window="+params.name);
    Ti.API.debug("GLEB - defaultView="+params.defaultView|| 0);
    Ti.API.debug('GLEB - DATOS DEL JSON: ' + JSON.stringify(params));
    
    for(v in params.views) {
        if( params.views[v].contentType =='grid' ){
            var view = new GlebGridView({
                name: params.views[v].name,
                style: params.views[v].style,
                data: params.views[v].content       
            });
            views.push(view);
        }
        else if( params.views[v].contentType =='market' ){
            var view = new GlebMarketView({
                name: params.views[v].name,
                style: params.views[v].style,
                data: params.views[v].content
            });
            views.push(view);
        }
        else if( params.views[v].contentType =='listMarket' ){
            var view = new GlebListMarketView({
                name: params.views[v].name,
                headerTitle: params.views[v].headerTitle,
                style: params.views[v].style,
                data: params.views[v].content
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
        }
        else if(params.views[v].contentType =='grid_3' ){
            var view = new GlebGridView3({
                name: params.views[v].name,
                style: params.views[v].style,
                data: params.views[v].content
            });
            views.push(view);
        }
        else if(params.views[v].contentType =='list' ){
            var view = new GlebListView({
                name: params.views[v].name,
                headerTitle: params.views[v].headerTitle,
                style: params.views[v].style,
                data: params.views[v].content
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
        }
        else if(params.views[v].contentType =='form' ){
            Ti.API.debug("GLEB - FORM_VIEW"+ JSON.stringify(params.views[v]));
            var view = new FormView({
                name: params.views[v].name,
                headerTitle: params.views[v].headerTitle,
                style: params.views[v].style,
                data: params.views[v].content
            });
            views.push(view);
        }
        else if(params.views[v].contentType =='webView' ){      
            Ti.API.info("GLEB - WEBVIEW URL"+ JSON.stringify(params.views[v]));         
            var view = new GlebWebView({
                name: params.views[v].name,
                url: params.views[v].url            
            });
            views.push(view);
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