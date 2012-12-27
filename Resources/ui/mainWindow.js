/**
* Module to manage main window
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

exports._get = function(params) {

    var mainWin = Titanium.UI.createWindow({
        backgroundColor:'#fff',
        backgroundImage: 'images/background.png',
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
       alert("Use el boton home de su terminal");
    });


    mainWin.addEventListener('close', function(e) {
    	Ti.API.debug("GLEB - Closing main window");
    });

    mainWin.addEventListener('open', function(){
        Ti.App.Properties.setBool('mainWinOpen', true);
    	require('plugins/checker').checkLocationStatus();
    });

    //Añadimos el status Bar
    mainWin.add(require('ui/statusBar').statusBar());

    //Añadimos mainView
    mainWin.add(require('ui/mainUI')._get(params));

    return mainWin;
};