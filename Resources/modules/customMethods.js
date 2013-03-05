/*
 * En este módulo definimos todos los métodos personalizados solicitados por el cliente
 */

/* Muestra una notificación de larga duración
 * @param1: es el texto de la notificación
 */
exports.showNotification = function(params) {
    var toast = Ti.UI.createNotification({
	    message:params.param1,
	    duration: Ti.UI.NOTIFICATION_DURATION_LONG
	});
	toast.show();
};


exports.scan = function(e){
/**
 * In this example, we'll use the Barcode module to display some information about
 * the scanned barcode.
 */
var Barcode = require('ti.barcode');
Barcode.allowRotation = true;
Barcode.displayedMessage = ' ';
Barcode.allowMenu = false;
Barcode.allowInstructions = false;
Barcode.useLED = true;

  /**
 * Create a chrome for the barcode scanner.
 */
var overlay = Ti.UI.createView({
    backgroundColor: 'transparent',
    top: 0, right: 0, bottom: 0, left: 0
});
var switchButton = Ti.UI.createButton({
    title: Barcode.useFrontCamera ? 'Back Camera' : 'Front Camera',
    textAlign: 'center',
    color: '#000', backgroundColor: '#fff', style: 0,
    font: { fontWeight: 'bold', fontSize: Ti.App.glebUtils._p(16) },
    borderColor: '#000', borderRadius: 10, borderWidth: 1,
    opacity: 0.5,
    width: Ti.App.glebUtils._p(220), height: Ti.App.glebUtils._p(30),
    bottom: 10
});
switchButton.addEventListener('click', function () {
    Barcode.useFrontCamera = !Barcode.useFrontCamera;
    switchButton.title = Barcode.useFrontCamera ? 'Back Camera' : 'Front Camera';
});
overlay.add(switchButton);
var cancelButton = Ti.UI.createButton({
    title: 'Cancel', textAlign: 'center',
    color: '#000', backgroundColor: '#fff', style: 0,
    font: { fontWeight: 'bold', fontSize: Ti.App.glebUtils._p(16) },
    borderColor: '#000', borderRadius: 10, borderWidth: 1,
    opacity: 0.5,
    width: Ti.App.glebUtils._p(220), height: Ti.App.glebUtils._p(30),
    top: 20
});
cancelButton.addEventListener('click', function () {
    var i=0;
    var codes ="";
    Ti.API.debug('GLEB - SCAN - Codes Stringify:' + JSON.stringify(scannedBarcodes));
    for (i=0; i< scannedBarcodesCount; i++){
        codes += scannedBarcodes[i]+", ";
    }
    codes = codes.substring(0, codes.length-2);
    Ti.API.debug('GLEB - SCAN - Codes:' + codes);
    Ti.UI.Clipboard.setText(codes);
    Barcode.cancel();
});
overlay.add(cancelButton);

var scannedBarcodes = {};
var scannedBarcodesCount = 0;

function reset() {
    scannedBarcodes = {};
    scannedBarcodesCount = 0;
    cancelButton.title = 'Cancel';
}
Barcode.addEventListener('error', function (e) {
    Ti.API.debug('GLEB - SCAN - Error');
});
Barcode.addEventListener('cancel', function (e) {
    Ti.API.debug('GLEB - SCAN - Cancel ');
});
Barcode.addEventListener('success', function (e) {
    Ti.API.debug('GLEB - SCAN - Success called with barcode: ' + JSON.stringify(e));
        Ti.API.debug('GLEB - SCAN - Success called with barcode: ' + e.result);
/*
    if (!scannedBarcodes['' + e.result]) {
        scannedBarcodes[e.result] = true;
        scannedBarcodesCount += 1;
        cancelButton.title = 'Finished (' + scannedBarcodesCount + ' Scanned)';
    }
*/
    if (e.result!= null) {
        scannedBarcodes[scannedBarcodesCount] = e.result;
        scannedBarcodesCount += 1;
        cancelButton.title = 'Finished (' + scannedBarcodesCount + ' Scanned)';
    }

});



function parseContentType(contentType) {
    switch (contentType) {
        case Barcode.URL:
            return 'URL';
        case Barcode.SMS:
            return 'SMS';
        case Barcode.TELEPHONE:
            return 'TELEPHONE';
        case Barcode.TEXT:
            return 'TEXT';
        case Barcode.CALENDAR:
            return 'CALENDAR';
        case Barcode.GEOLOCATION:
            return 'GEOLOCATION';
        case Barcode.EMAIL:
            return 'EMAIL';
        case Barcode.CONTACT:
            return 'CONTACT';
        case Barcode.BOOKMARK:
            return 'BOOKMARK';
        case Barcode.WIFI:
            return 'WIFI';
        default:
            return 'UNKNOWN';
    }
}

function parseResult(event) {
    var msg = '';
    switch (event.contentType) {
        case Barcode.URL:
            msg = 'URL = ' + event.result;
            break;
        case Barcode.SMS:
            msg = 'SMS = ' + JSON.stringify(event.data);
            break;
        case Barcode.TELEPHONE:
            msg = 'Telephone = ' + event.data.phonenumber;
            break;
        case Barcode.TEXT:
            msg = 'Text = ' + event.result;
            break;
        case Barcode.CALENDAR:
            msg = 'Calendar = ' + JSON.stringify(event.data);
            break;
        case Barcode.GEOLOCATION:
            msg = 'Geo = ' + JSON.stringify(event.data);
            break;
        case Barcode.EMAIL:
            msg = 'Email = ' + event.data.email + '\nSubject = ' + event.data.subject + '\nMessage = ' + event.data.message;
            break;
        case Barcode.CONTACT:
            msg = 'Contact = ' + JSON.stringify(event.data);
            break;
        case Barcode.BOOKMARK:
            msg = 'Bookmark = ' + JSON.stringify(event.data);
            break;
        case Barcode.WIFI:
            return 'WIFI = ' + JSON.stringify(event.data);
        default:
            msg = 'unknown content type';
            break;
    }
    return msg;
}


reset();
// Note: while the simulator will NOT show a camera stream in the simulator, you may still call "Barcode.capture"
// to test your barcode scanning overlay.
Barcode.capture({
    animate: true,
    overlay: overlay,
    showCancel: false,
    showRectangle: false,
    keepOpen: true/*,
acceptedFormats: [
    Barcode.FORMAT_QR_CODE
]*/
});

}

exports.openIntent = function(e){
    Ti.API.debug('GLEB - openIntent Event: '+JSON.stringify(e));
    Ti.API.debug('GLEB - Intent: '+e.intent);
    var glebandroidnative = require('es.gleb.androidnative');

    if (glebandroidnative.isAppInstalled(e.intent)){
        if (e.intent!="com.google.zxing.client.android"){
            var cName = glebandroidnative.getClassName(e.intent);
            Ti.API.debug('GLEB - YEAHHH: '+cName);
            var intent = Ti.Android.createIntent({
                action: Ti.Android.ACTION_MAIN,
                className: cName,
                packageName: e.intent
                });
            intent.addCategory(Ti.Android.CATEGORY_LAUNCHER);
            var activity = Ti.Android.currentActivity;
            activity.startActivity(intent);
        }
        else{
            var intent = Ti.Android.createIntent({action: "com.google.zxing.client.android.SCAN"});
            intent.putExtra("SCAN_MODE", "ONE_D_MODE");
            var activity = Ti.Android.currentActivity;
            activity.startActivityForResult(intent, function(e) {
                Ti.API.debug('GLEB - Intent Result: '+JSON.stringify(e));
                if (e.resultCode == Ti.Android.RESULT_OK) {
                    var contents = e.intent.getStringExtra("SCAN_RESULT");
                    var format = e.intent.getStringExtra("SCAN_RESULT_FORMAT");
                    Ti.API.debug('GLEB - Intent RESULT: '+contents+' format:'+format);
                    var n = Ti.UI.createNotification({message: "Contents: " + contents + ", Format: " + format, zIndex:10});
                    n.duration = Ti.UI.NOTIFICATION_DURATION_SHORT;
                    n.show();
                }
                else if (e.resultCode == Ti.Android.RESULT_CANCELED) {
                    var n = Ti.UI.createNotification({message: "Scan canceled!", zIndex:10});
                    n.duration = Ti.UI.NOTIFICATION_DURATION_SHORT;
                    n.show();
                }
                else if (e.error) {
                    Ti.Platform.openURL('market://details?id='+e.intent);
                }
                });
           }
    }
    else  Ti.Platform.openURL('market://details?id='+e.intent);
}

/* Metodo para el envio de imagenes al server
 * @param1: es la url donde se enviará la imagen. Si no se informa este parametro, se cogera la url definida en la aplicacion
 */
exports.sendImage = function(params) {
    var dialog = Titanium.UI.createOptionDialog({
    options: ['Capturar foto','Galería de imágenes', 'Cancelar'],
    cancel:2});

    var url = (params.param1 && params.param1 != '') ? params.param1 : require('clients/glebAPI.config').uploadImage_url;

    dialog.addEventListener('click', function(e) {
    	//OPCION "CAPTURAR FOTO"
        if (e.index == 0) {
			Titanium.Media.showCamera({
				saveToPhotoGallery:true,
				allowEditing:true,
				mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO],
				success:function(event) {
					// called when media returned from the camera
					if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
						//Se envia la imagen al server mediante un POST
	                    Ti.API.info("GLEB - Enviando imagen al GLEB server"+JSON.stringify(event));
	                    require("clients/glebAPI").uploadImage(event.media, url, "Upload image ("+event.media.file.name+")");
					} else {
						alert("El fichero seleccionado no es una imagen ="+event.mediaType);
					}
				},
				cancel:function() {
					// called when user cancels taking a picture
				},
				error:function(error) {
					// called when there's an error
					var a = Titanium.UI.createAlertDialog({title:'Cámara GLEB'});
					if (error.code == Titanium.Media.NO_CAMERA) {
						a.setMessage('Error al abrir la cámara del dispositivo');
					} else {
						a.setMessage('Error inesperado: ' + error.code);
					}
					a.show();
				}
			});
        }
        //OPCIÓN "GALERIA DE IMAGENES"
        else if (e.index == 1) {
            Titanium.Media.openPhotoGallery({
            	mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
			    success : function(event) {
			    	//Se envia la imagen al server mediante un POST
                    Ti.API.info("GLEB - Enviando imagen al GLEB server"+event.media.name);
                    require("clients/glebAPI").uploadImage(event.media, url,"Upload image ("+event.media.file.name+")");
				},
			    cancel : function() {

			    },
			    error : function(error) {
			    }
			});
        }
    });
    dialog.show();
};


/* Abre una ventana para la firma de un documento
 * @param1: es la url del documento a firmar
 */
exports.openSignWindow = function(params) {
	Ti.API.info("GLEB - openSignWindow");
    var win = new Titanium.UI.createWindow({
		orientationModes : [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT],
		navBarHidden: true
	});
	win.modal = true;

	var n=params.param1.split("/"); 
	var lastItem = n.length-1;
	var auxImageName = n[lastItem];
	var m=auxImageName.split(".");
	var imageNameWithoutExt = m[0];
	
	var imageName = (params.param3 && params.param3 != '') ? params.param3 : imageNameWithoutExt+'Signature.jpeg';
	
	var url = (params.param2 && params.param2 != '') ? params.param2 : require('clients/glebAPI.config').uploadSignature_url;
	
	var imageView = Ti.UI.createWebView({
		url: params.param1,
		bottom: Ti.App.glebUtils._p(160)
	});

	var viewDocument = new Titanium.UI.createView({
		backgroundColor:'white',
		width:'auto',
   		height:'auto'
	});
	viewDocument.setTop(Ti.App.glebUtils._p(46));

	viewDocument.add(imageView);
	
	win.add(viewDocument);


	// Creamos el header de la tabla. FIJO
	var viewTitle = Ti.UI.createView({
		backgroundColor:"#575252",
		width:Ti.App.glebUtils._p(320),
		height:Ti.App.glebUtils._p(20),
		top:Ti.App.glebUtils._p(0)
	});
	var labelTitle = Ti.UI.createLabel({
		text: "Firme a continuación:",
		width:Ti.App.glebUtils._p(245),
		height:"auto",
		color:"white",
		textAlign:"left",
		left: Ti.App.glebUtils._p(10),
		font:{fontSize:Ti.App.glebUtils._p(14),fontWeight:"bold"},
		shadowColor:"#A7A7A7",
		shadowOffset:{x:Ti.App.glebUtils._p(1),y:Ti.App.glebUtils._p(1)},
		minimumFontSize: Ti.App.glebUtils._p(8)
	});
	viewTitle.setTop(Ti.App.glebUtils._p(350));
	viewTitle.add(labelTitle);
	win.add(viewTitle);

	var Paint = require('ti.paint');
	var viewSign = new Titanium.UI.createView({
		backgroundColor:'white',
		width:'auto',
   		height:'auto'
	});
	viewSign.setTop(Ti.App.glebUtils._p(370));

	var paintView = Paint.createPaintView({
	    top:Ti.App.glebUtils._p(0),
	    right:Ti.App.glebUtils._p(0),
	    bottom:Ti.App.glebUtils._p(30),
	    left:Ti.App.glebUtils._p(0),
	    // strokeWidth (float), strokeColor (string), strokeAlpha (int, 0-255)
	    strokeColor:'black', strokeAlpha:255, strokeWidth:Ti.App.glebUtils._p(3),
	    eraseMode:false
	});

	viewSign.add(paintView);
	win.add(viewSign);

	var viewFooter = new Titanium.UI.createView({
		backgroundColor:'white',
		bottom:Ti.App.glebUtils._p(0),
		height:Ti.App.glebUtils._p(30)
	});

	var clear = Ti.UI.createButton({
			bottom:Ti.App.glebUtils._p(0),
			left:Ti.App.glebUtils._p(50),
			width:Ti.App.glebUtils._p(100),
			height:Ti.App.glebUtils._p(30),
			title:'Borrar',
	 	    font: { fontSize: Ti.App.glebUtils._p(14)}
	});
	clear.addEventListener('click', function() {
		//Titanium.Media.vibrate([ 0, 100]);
		paintView.clear();
	});
	viewFooter.add(clear);

	var save = Ti.UI.createButton({
		bottom:Ti.App.glebUtils._p(0),
		right:Ti.App.glebUtils._p(50),
		width:Ti.App.glebUtils._p(100),
		height:Ti.App.glebUtils._p(30),
		title:'Guardar',
 	    font: { fontSize: Ti.App.glebUtils._p(14)}
	});
	save.addEventListener('click', function() {
		//Titanium.Media.vibrate([ 0, 100]);
		var captura = viewSign.toImage();
		var tmpImageView = Titanium.UI.createImageView({
	        width: Ti.UI.FILL,
	        height: Ti.UI.SIZE,
	        image: captura,
	        top:0,
	        left:0,
	        borderColor: 'black',
	        borderWidth: 2
	    });
	    viewSign.add(tmpImageView); //you must add it to your window!
		var saveImageData = tmpImageView.toBlob();
		
		//Se envia la firma al server mediante un queuePOST
		Ti.API.info("GLEB - Enviando firma al GLEB server");
		require("clients/glebAPI").uploadImage(saveImageData, url, "Upload signature ("+imageName+")");

		/*
		var isExternalStoragePresent = Ti.Filesystem.isExternalStoragePresent();
		if (isExternalStoragePresent) {
			Ti.API.debug('GLEB - Objeto'+captura);
			Ti.API.debug('GLEB - PATH= '+Titanium.Filesystem.externalStorageDirectory);
			var uiDir = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory,'gleb');
			if (!uiDir.exists()) {
				uiDir.createDirectory();
			}
		   var f = Titanium.Filesystem.getFile(uiDir.resolve(), "firma.jpeg");
		   Ti.API.debug("GLEB - Path firma:"+f.resolve());
			if (f.write(saveImageData)===false) {
			   // handle write error
			   Ti.API.debug("GLEB - Ha habido un error guardando el UI");
			}
			else {
				Ti.API.debug("GLEB - Firma guardada");
				alert ("Firma guardada");
				viewSign.remove (tmpImageView);
				tmpImageView = null;
			}
		}
		*/
	});
	viewFooter.add(save);

	win.add(viewFooter);

	require('modules/NavigationController').open(win);
};



/* Abre una ventana con la lista de peticiones HTTP encoladas
 */
exports.showQueueHTTP = function() {  

var firstTime = true;

var win = new Titanium.UI.createWindow({
	orientationModes : [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT],
	navBarHidden: true,
});    			
win.modal = true;	

var arrayHttpRequests = [];

var containerListView = Ti.UI.createView({
    borderWidth: 0,
    backgroundColor: "white",
    layout: "vertical",
    width: Ti.UI.FILL,
    height: Ti.UI.FILL
}); 
containerListView.setTop(Ti.App.glebUtils._p(46));

// Creamos el header de la tabla. FIJO
var header = Ti.UI.createView({
    backgroundColor:"#575252",
    width: Ti.App.glebUtils._p(320),
    height:Ti.App.glebUtils._p(30),
    top:Ti.App.glebUtils._p(0)
});
var headerTitle = Ti.UI.createLabel({
    text: 'Lista de peticiones HTTP encoladas',
    left:Ti.App.glebUtils._p(0),
    width:Ti.UI.FILL,
    top:Ti.App.glebUtils._p(2),
    height:"auto",
    color:"white",
    textAlign:"center",
    font:{fontSize:Ti.App.glebUtils._p(18),fontWeight:"bold"},
    shadowColor:"#A7A7A7",
    shadowOffset:{x:Ti.App.glebUtils._p(1),y:Ti.App.glebUtils._p(1)}
});
header.add(headerTitle);
//Añadmos el header al container
containerListView.add(header);


containerListView._get = function() {
     
    //Ti.API.debug('GLEB - Container views childrens: '+containerListView.getChildren());
    if (containerListView.children[1]) containerListView.remove (containerListView.children[1]);
    //Ti.API.debug('GLEB - Container views childrens: '+containerListView.getChildren());
    /* Añadimos el scrollView al container View */    
    containerListView.add(populateView(recoveryDataQueueHttp()));

	if(firstTime){
		win.add(containerListView);
		require('modules/NavigationController').open(win);	
		firstTime = false;	
	}
    
    Ti.App.glebUtils.closeActivityIndicator();
    
    return;
};


containerListView._refresh = function (e){
    //Ti.App.glebUtils.openActivityIndicator({"text":"Actualizando lista ..."});
    //Volver a obtener el resultSet con las peticiones encoladas 
    containerListView._get();
    //containerListView.add(populateView(recoveryDataQueueHttp())); 
}   

return containerListView._get();


function recoveryDataQueueHttp()
{	
	//Limpiamos el array
	arrayHttpRequests = [];
	
	var db = Ti.Database.open('queueHttpBD');  
	 
	try {
	   rows = db.execute('SELECT description, timestamp, status, counts, last FROM HTTP_REQUESTS ORDER BY timestamp DESC');
	}
	catch (err){
	    Ti.API.error("GLEB - colaHTTP - Fail to select db rows");
	    return;
	}
	while (rows.isValidRow()) {
		
		httpRequest = {
			description: rows.fieldByName('description'),
			timestamp: rows.fieldByName('timestamp'),
			status: rows.fieldByName('status'),
			counts: rows.fieldByName('counts'),
			last: rows.fieldByName('last')
		}
		arrayHttpRequests.push(httpRequest);
	    rows.next();
	}   
	rows.close();
	db.close();
	db= null;
	rows = null;
	
	return arrayHttpRequests;
}

function formatDate(timestamp)
{
    var d = new Date(timestamp); 
    var date=d.getDate();
    var month=d.getMonth();
    month++;
    var year=d.getFullYear();  
    var hour=d.getHours();
    var min = d.getMinutes();
    if (min< 10){
       min = "0"+min;
    }
    var seconds=d.getSeconds();
    datestr = date + "-" + month + "-" + year + " " + hour + ":" + min + ':' + seconds;
    //datestr=' '+hour+':'+min;*/
    //datestr=d.toUTCString();
    return datestr;
}
        

function populateView (data){
    // Creamos el scrollview que va a contener el tableView
    var scrollView = Ti.UI.createScrollView({
        zIndex:2,
        height: Ti.App.glebUtils._p(Ti.App.Properties.getInt("platformHeight")),
        width: Ti.UI.FILL,
        showVerticalScrollIndicator: true,
        backgroundColor: 'white',            
        scrollType: "vertical",
        layout: "vertical"  
    });     
    
    ///////////////////// 
    //INSERTAMOS LA BARRA DE REFRESCO
	//OBTENEMOS EL PULL VIEW ROW PARA EL REFRESCO DE LA VISTA
	var RefreshBar = require('ui/refreshBar');
	var refreshBarListView = new RefreshBar();
    // Añadimos el PULL VIEW como primer row de la tabla
    scrollView.add(refreshBarListView);
	       
    scrollView.setContentOffset({x: 0, y: Ti.App.glebUtils._p(60)});
	///////////////////// 

	for(var item in arrayHttpRequests) {
		Ti.API.debug('El JSON es: '+JSON.stringify(arrayHttpRequests[item]));
		Ti.API.debug('El JSON es: '+arrayHttpRequests[item].nombre);
	    
	    var color = 'white';
	    switch (arrayHttpRequests[item].status){
	    	case 'pending':
	    		color = 'yellow';
	    		break;
	    	case 'uploaded':
	    		color = 'green';
	    		break;
	    	case 'error':
	    		color = 'red';
	    		break;
	    }
	    row = Ti.UI.createView({
                width: Ti.UI.FILL,
                height: Ti.UI.SIZE,                     
                backgroundColor: color,
                borderWidth: 2,
                borderColor: 'black',
                //top: Ti.App.glebUtils._p(5) ,
                //bottom: Ti.App.glebUtils._p(5) ,
                layout: 'vertical'
        });     
        
        var label1 = Ti.UI.createLabel({
            text: 'Descripción: '+arrayHttpRequests[item].description,
            color: 'black',
            font: { fontSize: "12dp"},
            height:'auto',
            width:Ti.UI.FILL,                   
            textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
            left: "10dp",
            touchEnabled:false
        });     
        row.add(label1);
        var label2 = Ti.UI.createLabel({
            text: 'Fecha petición: '+formatDate(arrayHttpRequests[item].timestamp)+'    Estado: '+arrayHttpRequests[item].status,
            color: 'black',
            font: { fontSize: "12dp"},
            height:'auto',
            width:Ti.UI.FILL,                   
            textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
            left: "10dp",
            touchEnabled:false
        });   
        row.add(label2);
		
		if(arrayHttpRequests[item].counts > 0){
			var label3 = Ti.UI.createLabel({
	            text: 'Intentos: '+arrayHttpRequests[item].counts+'    Fecha último intento: '+formatDate(arrayHttpRequests[item].last),
	            color: 'black',
	            font: { fontSize: "12dp"},
	            height:'auto',
	            width:Ti.UI.FILL,                   
	            textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	            left: "10dp",
	            touchEnabled:false
	        });   
	        row.add(label3);	
		}
        
	   	scrollView.add(row);
	}
	
	//Añadimos un relleno transparente a la vista
    if(data.length * Ti.App.glebUtils._p(60) < Ti.App.glebUtils._p(900)) {
        var rowAux = Ti.UI.createView({
                width: "100%",
                height: Ti.App.glebUtils._p(900) - (data.length * Ti.App.glebUtils._p(60)),
                backgroundColor: 'transparent'
        });
        scrollView.add(rowAux);
    }  
    
    // update the offset value whenever scroll event occurs
	RefreshBar.addListenersRefreshBar(refreshBarListView, scrollView, containerListView);

    return scrollView;
}
};
