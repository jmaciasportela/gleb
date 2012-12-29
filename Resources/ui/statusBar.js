/**
* @version 0.1
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/


module.exports = function(){  

var scrollView;

//Añadimos las vistas al status bar
Ti.API.debug('GLEB - Creando Status Bar');
var recargaView = require('ui/statusBar/recargaView');
var gpsView = require('ui/statusBar/gpsView');
var compassView = require('ui/statusBar/compassView');
var bannerView = require('ui/statusBar/bannerView');
var msgView = require('ui/statusBar/msgView');
var statusView = require('ui/statusBar/status');

scrollView = Titanium.UI.createScrollableView({
        views: [statusView._get(), gpsView._get(), new compassView(), new recargaView(), new msgView(), new bannerView()],      
        showPagingControl: false,       
        maxZoomScale:2.0,
        layout: "horizontal",
        currentPage:1,
        top: Ti.App.glebUtils._p(3),
        left: Ti.App.glebUtils._p(2),
        right: Ti.App.glebUtils._p(2),
        height: Ti.App.glebUtils._p(40),        
    });

scrollView.addEventListener('scroll', function(e) { 
    //Ti.API.debug('GLEB - Status bar current page:'+JSON.stringify(e));
    if (e.currentPage==2 && !Ti.App.Properties.getBool('headingActive')) {      
        require ("plugins/heading").start();
    }
    else if (e.currentPage!=2 && Ti.App.Properties.getBool('headingActive')) require ("plugins/heading").stop();
});


return scrollView;

}


/*
var scrollView=null;

function populate() {
//Añadimos las vistas al status bar
Ti.API.debug('GLEB - Creando Status Bar');
var recargaView = require('ui/statusBar/recargaView');
var gpsView = require('ui/statusBar/gpsView');
var compassView = require('ui/statusBar/compassView');
var bannerView = require('ui/statusBar/bannerView');
var msgView = require('ui/statusBar/msgView');
var statusView = require('ui/statusBar/status');

scrollView = Titanium.UI.createScrollableView({
		views: [statusView._get(), gpsView._get(), new compassView(), new recargaView(), new msgView(), new bannerView()],		
		showPagingControl: false,		
		maxZoomScale:2.0,
		layout: "horizontal",
		currentPage:1,
		top: Ti.App.glebUtils._p(3),
		left: Ti.App.glebUtils._p(2),
		right: Ti.App.glebUtils._p(2),
		height: Ti.App.glebUtils._p(40),		
	});

scrollView.addEventListener('scroll', function(e) {	
	//Ti.API.debug('GLEB - Status bar current page:'+JSON.stringify(e));
	if (e.currentPage==2 && !Ti.App.Properties.getBool('headingActive')) {		
		require ("plugins/heading").start();
	}
	else if (e.currentPage!=2 && Ti.App.Properties.getBool('headingActive')) require ("plugins/heading").stop();
});

}

exports.statusBar = function() {	
	Ti.API.debug('GLEB - statusBar:'+ scrollView );
	if (scrollView==null) populate();
	return scrollView;
}

exports.statusBarToRight = function() {
	Ti.API.debug('GLEB - Status bar a la derecha');	
	scrollView.currentPage = scrollView.currentPage + 1;	
}

exports.statusBarToLeft = function() {
	Ti.API.debug('GLEB - Status bar a la izquierda');
	scrollView.currentPage = scrollView.currentPage - 1;	
}

*/