/**
* Plugin to control upload pending HTTP request
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

Ti.API.debug('GLEB - UPLOADER - Loading UPLOADER plugin');

exports.start = function() {
/********************* POST *************************************/
var makePOST = function(url,tout,body,blob,headers,callback,f_callback){

	Ti.API.debug('GLEB - UPLOADER - make POST to ' + url);

	var xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(tout);
	xhr.onload = function(e)
	{
		Ti.API.debug('GLEB - UPLOADER - onload called, HTTP status = '+this.status);
		eval ("require (\"clients/glebAPI\")."+callback)(this, e);
		f_callback (this, e);
	};

	xhr.onerror = function(e)
	{
		try {
			Ti.API.debug('GLEB - UPLOADER - onerror: '+JSON.stringify(e));
		}
		catch (err) {
			Ti.API.debug('GLEB - UPLOADER - onerror');
		}
		eval ("require (\"clients/glebAPI\")."+callback)(this, e);
		f_callback (this, e);
	};


	xhr.open("POST", url);

	if (headers) {
		for (var header in headers){
			Ti.API.debug('GLEB - UPLOADER - '+header+':'+headers[header]);
			xhr.setRequestHeader(header,headers[header]);
		}
	}

	Ti.API.debug("GLEB - UPLOADER - BODY: " + body +" BLOB: " +blob);

	if (body=="" && blob != null) {
		Ti.API.debug('GLEB - UPLOADER - Uploading binary data');
		xhr.send({file:blob.read()});
	}
	else if (body!="" && blob ==null) {
		Ti.API.debug('GLEB - UPLOADER - Uploading JSON data');
		xhr.send(body);
	}
	else if (body!="" && blob != null) {
		Ti.API.debug('GLEB - UPLOADER - Uploading JSON data');
		xhr.send({file:blob.read()});
	}
	else {
		Ti.API.debug('GLEB - UPLOADER - Uploading');
		xhr.send();
	}

}
/******************* FIN DEL POST  ******************************/

//Declaramos las variables que se almacenan en la BD por cada petición Http
var id = "";
var network = "";
var methodHttp = "";
var url = "";
var timeout = "";
var urlParams = "";
var headers = "";
var body = "";
var file = "";
var timestamp = "";
var lastTry = "";
var tryCounts = "";
var status = "";
var callback = "";

	//Abrimos BD
	var db = Ti.Database.open('queueHttpBD');
	var listHttpRequests = db.execute("SELECT * FROM HTTP_REQUESTS WHERE STATUS = 'uploading'");
	var pendingFiles = db.execute("SELECT * FROM HTTP_REQUESTS WHERE STATUS != 'uploading'");
	db.close();
	Titanium.API.debug("GLEB - UPLOADER - archivos en cola "+pendingFiles.getRowCount());

	if (listHttpRequests.getRowCount()==0 && pendingFiles.getRowCount()!=0) {
		//El servicio sólo actuará si existe cobertura de datos
		if(Titanium.Network.online){
			Titanium.API.debug("GLEB - UPLOADER - Device is attached to data network");
			if (Titanium.Network.networkTypeName == 'MOBILE'){
				Titanium.API.debug("GLEB - UPLOADER - Looking for files to be uploaded by 3G/GPRS");
				db = Ti.Database.open('queueHttpBD');
				listHttpRequests = db.execute("SELECT * FROM HTTP_REQUESTS WHERE STATUS != 'uploaded' AND STATUS != 'uploading' AND NETWORK =='MOBILE' ORDER BY TIMESTAMP ASC");
				db.close();
			}
			else {
				Titanium.API.debug("GLEB - UPLOADER - Looking for files to be uploaded by WIFI");
				db = Ti.Database.open('queueHttpBD');
				listHttpRequests = db.execute("SELECT * FROM HTTP_REQUESTS WHERE STATUS != 'uploaded' AND STATUS != 'uploading' ORDER BY TIMESTAMP ASC");
				db.close();
			}
			Ti.API.info('GLEB - UPLOADER - Pending Files = '+listHttpRequests.getRowCount());
			//Después de ejecutar la consulta y guardar el resultado en el ResultSet, recorremos una a una las peticiones almacenadas
			if (listHttpRequests.isValidRow())	{
				//Recupero todos los datos de cada registro de la BD
				id = listHttpRequests.fieldByName('id');
				network = listHttpRequests.fieldByName('network');
				methodHttp = listHttpRequests.fieldByName('method_http');
				url = listHttpRequests.fieldByName('url');
				timeout = listHttpRequests.fieldByName('timeout');
				urlParams = JSON.parse(listHttpRequests.fieldByName('params'));
				headers = JSON.parse(listHttpRequests.fieldByName('headers'));
				body = listHttpRequests.fieldByName('body');
				file = listHttpRequests.fieldByName('file');
				lastTry = listHttpRequests.fieldByName('last');
				tryCounts = listHttpRequests.fieldByName('counts');
				status = listHttpRequests.fieldByName('status');
				callback = listHttpRequests.fieldByName('callback');

				Ti.API.debug('GLEB - UPLOADER - URL:' + url + ' TOUT:' + timeout + ' BODY:' + body + ' FILE:' + file + ' HEADERS:' + headers + ' CALLBACK:' + callback);
				Ti.API.debug('GLEB - UPLOADER - FILE: ' + file);

				if (file !="") var blob = Titanium.Filesystem.getFile(file);

				var f_callback = function (obj,e){
					if (e.error) {
				        Ti.API.debug('GLEB - UPLOADER - f_callback Error, HTTP status = '+obj.status);
				        //Ti.API.debug('GLEB - UPLOADER - RESPONSE = '+JSON.stringify(obj));
				        tryCounts++;
						var now = parseInt(new Date().getTime()/1000);
						db = Ti.Database.open('queueHttpBD');
						db.execute('UPDATE HTTP_REQUESTS SET LAST="' + now.valueOf() + '", COUNTS="' + tryCounts + '" WHERE ID="' + id + '"');
						db.close();
			    		Ti.App.fireEvent ('refreshHTTPTable');
			    		Ti.App.Properties.setBool ('isUploading',false);
			        }
					else {
				        Ti.API.debug('GLEB - UPLOADER - f_callback called, HTTP status = '+obj.status);
		    			//Ti.API.debug('GLEB -  RESPONSE = '+JSON.stringify(obj));
			        	//var response =  JSON.parse(obj.responseText);
				        //Ti.API.debug('GLEB -  RESPONSE = '+JSON.stringify(obj));
				        //Comprobamos que el estado del response recibido es ok (code=200)
						if(obj.status == 200){
							//La petición se ha enviado correctamente y podemos borrarla de BD
							Ti.API.debug('GLEB - BORRANDO FICHERO DE LA COLA');
							db = Ti.Database.open('queueHttpBD');
							db.execute('DELETE FROM HTTP_REQUESTS WHERE ID="' + id + '"');
							db.close();
				    		Ti.App.fireEvent ('refreshHTTPTable');
				    		Ti.App.Properties.setBool ('isUploading',false);
						}
						else{
							//La petición NO se ha enviado correctamente, por lo que incrementamos el contador de BD y actualizamos el campo LAST_TRY del registro de BD
							tryCounts++;
							var now = parseInt(new Date().getTime()/1000);
							db = Ti.Database.open('queueHttpBD');
							db.execute('UPDATE HTTP_REQUESTS SET LAST="' + now + '", COUNTS="' + tryCounts + '" WHERE ID="' + id + '"');
							db.close();
				    		Ti.App.fireEvent ('refreshHTTPTable');
				    		Ti.App.Properties.setBool ('isUploading',false);
						}
					}
				} // FIN CALLBACK
			Ti.App.Properties.setBool ('isUploading',true);
			makePOST (url,timeout,body,blob,headers,callback,f_callback);
		}
		else Ti.App.Properties.setBool ('isUploading',false);
	} // IF NETWORK

	} // IF FILES
	else {
		Ti.API.info('GLEB - UPLOADER - HTTP queue empty');
		Ti.App.Properties.setBool ('isUploading',false);
	}
	db.close();
	listHttpRequests.close();
	pendingFiles.close();
	db = null;
	listHttpRequests = null;
	pendingFiles = null;
}
