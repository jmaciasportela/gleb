/**
* Wizard
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

var scrollableView;
var view0 = require('ui/wizard/pagina_0')._get();
var view1 = require('ui/wizard/pagina_1')._get();
var view2 = require('ui/wizard/pagina_2')._get();
var view3 = require('ui/wizard/pagina_3')._get();


exports._open = function() {   
    _set(); 
    var win = require ("modules/controlWindow").createWindow(scrollableView);    
    Ti.API.debug("GLEB - WIZARD - win: " + win);  
    win.open();    
}

_set = function() {
    
  Ti.API.info("GLEB - Set wizard");     
    
  scrollableView = Ti.UI.createScrollableView({
        backgroundColor: "black",
        borderWidth: 0,
        showPagingControl: false,       
        maxZoomScale:2.0,
        layout: "horizontal",
        currentPage:1,
        opacity: 0.75,
        borderRadius:0,
        contentHeight: "auto",
        contentWidth: "auto",
        views: [view0,view1,view2,view3],           
        scrollingEnabled : false,
        touchEnabled: false 
    }); 
}

exports.toLeft = function() {
    Ti.API.info('GLEB - wizard a la izquierda');
    scrollableView.currentPage = scrollableView.currentPage - 1;
}

exports.toRight = function() {
    Ti.API.info('GLEB - wizard a la derecha');
    if (scrollableView.currentPage ==2) view2.msisdn (Ti.App.Properties.getString("telf"));     
    if (scrollableView.currentPage ==3) {           
       Titanium.API.info("GLEB - Button Save from wizard click");
       //Salvamos parametros
       Ti.App.Properties.setString("WIZARD","done");
       //Disparamos evento
       Ti.App.fireEvent("gleb_wizard_end");
    }       
    else scrollableView.currentPage = scrollableView.currentPage + 1;
}

exports.setPage = function(page) {
    scrollableView.currentPage = page;
}


