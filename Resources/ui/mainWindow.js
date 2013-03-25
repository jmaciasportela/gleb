/**
* Module to manage main window
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

exports._get = function(params) {

	var windowStyle = params.style || {};
	
    mainWin = Titanium.UI.createWindow({
        backgroundColor: windowStyle.backgroundColor || 'transparent',
        borderColor: windowStyle.borderColor || 'black',
        borderWidth: windowStyle.borderWidth || 0,
    	backgroundImage: windowStyle.backgroundImage || 'images/background.png',
    	orientationModes : [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT],
    	exitOnClose: false,
    	navBarHidden: true
    });

    mainWin.addEventListener('open',function(){
        Ti.App.glebUtils.closeActivityIndicator();
    	mainWin.removeEventListener('postlayout',function(){});
    	Ti.API.debug('GLEB - Main Win Open');
    });
    
    mainWin.addEventListener('android:back', function(){        
        var alertDialog = Titanium.UI.createAlertDialog({
            title: 'Salir de GLEB',
            message:'¿Desea cerrar GLEB?',
            buttonNames: ['SI','NO']
        });         
        alertDialog.addEventListener('click', function(e)
            {
            if (e.index==0) {   
                require('plugins/newgps').stop(); 
                require("modules/initFlow").servicioGLEBSTOP();
                var activity = Titanium.Android.currentActivity;
                activity.finish();                
            }            
        }); 
        alertDialog.show();
    });
    

    mainWin.addEventListener('close', function(e) {
    	Ti.API.debug("GLEB - Closing main window");
    	Ti.App.Properties.setBool('mainWinOpen', false);
    });

    mainWin.addEventListener('open', function(){
        Ti.App.Properties.setBool('mainWinOpen', true);        
        // Para checkear si el GPS esta activo
    	require('plugins/newgps').warningGPS();
    });

    mainWin.addEventListener('focus', function(){
        Ti.API.debug("GLEB - Main win pilla el foco");
        if (Ti.App.Properties.getBool("actionsON")){
            require('plugins/bootAction').checkAction();
        }
    });

    //Añadimos el status Bar
    var stbar = require('ui/statusBar');
    mainWin.add(new stbar());

    //Añadimos mainView
    mainWin.add(require('ui/mainUI')._get(params));

    return mainWin;
};