/*
 * This file has a method to check Location Availability
 */

exports.checkLocationStatus = function (){
		if (Ti.App.Properties.getBool('GPSOff') && !Ti.App.Properties.getBool('avisoGPS')) {	
			Ti.API.debug('GLEB - GPS deshabilitado');
			var alertDialog = Titanium.UI.createAlertDialog({
    			title: 'Aviso',
    			message:'Para conseguir un funcionamiento óptimo de la aplicación es necesario activar la localización GPS',
			    buttonNames: ['ACTIVAR','CANCEL']
			});			
			alertDialog.addEventListener('click', function(e)
				{
				if (e.index==0) {	
					var intent = Ti.Android.createIntent({action: "android.settings.LOCATION_SOURCE_SETTINGS"});
					Ti.Android.currentActivity.startActivity(intent);				
				}
				else {
					var alertDialog2 = Titanium.UI.createAlertDialog({
    				title: 'Aviso',
    				message:'La precisión obtenida a través de las redes inhalambricas podría no ser suficiente para el correcto funcionamiento de GLEB',
			    	buttonNames: ['OK']
					});		
					alertDialog2.show();
				}
			});	
			alertDialog.show();
			Ti.App.Properties.setBool('avisoGPS',true);      			
			}				
};