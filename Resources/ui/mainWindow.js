/*
 * Fabrica de ventanas main
 */
exports._get = function(params) {

mainWin = Titanium.UI.createWindow({  
    	backgroundColor:'#fff',
		backgroundImage: 'images/background.png',
		orientationModes : [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT],
		exitOnClose: false,
		navBarHidden: true
});
mainWin.addEventListener('postlayout',function(){	
	Ti.App.fireEvent('gleb_closeActivityIndicator');
	mainWin.removeEventListener('postlayout',function(){});
	Ti.API.info('GLEB - Main Win PostLayout');
});

mainWin.add(require('ui/mainUI')._get(params));

var salir = function(e) {	
    	Ti.API.info("GLEB - Pressing Back Will Not Close The Activity/Window");
    	Ti.App.fireEvent('gleb_enableExit');
    	var alertDialog = Titanium.UI.createAlertDialog({
    			title: 'GLEB',
    			message:'No se recomienda salir de GLEB, use el botón HOME para acceder al telefono. Si realmente desea salir pulse OK y BACK de nuevo.',
			    buttonNames: ['OK','CANCELAR']
			});			
			alertDialog.addEventListener('click', function(e)
				{
				if (!e.index==0) {					
					Ti.App.fireEvent('gleb_disableExit');
				}									
			});	
			alertDialog.show();
}
	
mainWin.addEventListener('android:back', salir);	
	
Ti.App.addEventListener ('gleb_enableExit', function(){
	mainWin.removeEventListener('android:back', salir);
});

Ti.App.addEventListener ('gleb_disableExit', function(){
	mainWin.addEventListener('android:back', salir);
});

mainWin.addEventListener('close', function(e) {
	Ti.API.info("GLEB - Closing main window");    	
});

mainWin.addEventListener('open', function(){	
	require('plugins/checker').checkLocationStatus();
});	

return mainWin;

};