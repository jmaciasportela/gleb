var scrollView=null;

function populate() {
//Añadimos las vistas al status bar
Ti.API.info('GLEB - Creando Status Bar');
var recargaView = require('ui/statusBar/recargaView');
var gpsView = require('ui/statusBar/gpsView');
var compassView = require('ui/statusBar/compassView');
//var reverseLocationView = require('ui/statusBar/reverseLocationView');
var bannerView = require('ui/statusBar/bannerView');
var msgView = require('ui/statusBar/msgView');
var debugView = require('ui/statusBar/debug');

scrollView = Titanium.UI.createScrollableView({
		views: [recargaView._get(), gpsView._get(),compassView._get(),msgView._get(),debugView._get(),bannerView._get()],
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

//return scrollView;
}

exports.statusBar = function() {	
	Ti.API.info('GLEB - statusBar:'+ scrollView );
	if (scrollView==null) populate();
	return scrollView;
}

exports.statusBarToRight = function() {
	Ti.API.info('GLEB - Status bar a la derecha');	
	scrollView.currentPage = scrollView.currentPage + 1;	
}

exports.statusBarToLeft = function() {
	Ti.API.info('GLEB - Status bar a la izquierda');
	scrollView.currentPage = scrollView.currentPage - 1;	
}

