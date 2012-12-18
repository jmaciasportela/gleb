/**
* Wizard
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

var scrollableView;
var view0 = new require('ui/wizard/pagina_0')();
var view1 = new require('ui/wizard/pagina_1')();
var view2 = new require('ui/wizard/pagina_2')();
var view3 = new require('ui/wizard/pagina_3')();


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
    Ti.API.debug('GLEB - wizard a la derecha');
    if (scrollableView.currentPage ==2) view2.msisdn(Ti.App.Properties.getString("telf"));
    if (scrollableView.currentPage ==3) {
       Titanium.API.debug("GLEB - Button Save from wizard click");
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

exports.close = function() {
    view0 = null;
    view1 = null;
    view2 = null;
    view3 = null;
    scrollableView = null;
    require("modules/controlWindow").closeWindow(0);
}

