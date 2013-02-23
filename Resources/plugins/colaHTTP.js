/**
* Plugin to control pending HTTP request
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

Ti.API.debug('GLEB - colaHTTP - Loading HTTP queue plugin');

exports.start = function(){	
	Ti.API.debug("GLEB - colaHTTP - Init DB");
	var db = Ti.Database.install(Titanium.Filesystem.resourcesDirectory+'sql/queueHTTP.sqlite','queueHttpBD');	
	 
	try {
	   rows = db.execute('SELECT * FROM HTTP_REQUESTS');
	}
	catch (err){
	    Ti.API.error("GLEB - colaHTTP - Fail to select db rows");
	    return;
	}
	while (rows.isValidRow()) {
	    db.execute('UPDATE HTTP_REQUESTS SET STATUS="pending" WHERE ID="' + rows.fieldByName('id') + '"');
	    Ti.API.debug("GLEB - colaHTTP - Reset status to pending ID: " +rows.fieldByName('id'));
	    rows.next();
	}	
	rows.close();
	db.close();
	db= null;
	rows = null;
	
	Ti.App.Properties.setBool('isUploading',false);
	
	// Starting service like
	setInterval (function(){	
		if (!Ti.App.Properties.getBool('isUploading')) {
		    Ti.API.debug('GLEB - colaHTTP - Checking HTTP QUEUE to start new upload');
		    require('plugins/uploader').start();
		}   
		else  Ti.API.debug('GLEB - colaHTTP - Uploading file, skipping to next interval');
	},parseInt(Ti.App.Properties.getString('tUpload')));
} 