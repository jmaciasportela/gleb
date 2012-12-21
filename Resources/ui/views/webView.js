/**
 * webview
 * Returns a grid with autorefresh market styled
 * 
 * @param args		JSON to construct this View
  * 
 * @return Ti.UI.View webview Type with auto refresh
 */

module.exports = function(params){	
	
Ti.API.debug("GLEB - WEBVIEW:"+JSON.stringify(params) );

var containerView = Ti.UI.createView({
	borderWidth: 0,
	backgroundColor: "transparent",
	width: Ti.UI.FILL,
	name: params.name		
}); 

var webView = Ti.UI.createWebView({
	url: params.url,
	loading: true,
	showScrollbars: true
});

containerView.add (webView); 
/* Retornamos el container */
return containerView;

};

