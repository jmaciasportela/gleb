/**
* Plugin to control pending HTTP request
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

Ti.API.debug('GLEB - colaHTTP - Loading HTTP queue plugin');

var ColaStarted = false;

exports.ColaStatus = function (){ 
 return ColaStarted;
}

exports.start = function(){		
	// Starting service like
	setInterval (function(){	
		if (!Ti.App.Properties.getBool('isUploading')) {
		    //Ti.API.debug('GLEB - colaHTTP - Checking HTTP QUEUE to start new upload');
		    ColaStarted = true;
		    require('plugins/uploader').start();
		}   
		else  Ti.API.debug('GLEB - colaHTTP - Uploading file, skipping to next interval');
	},10000);
} 