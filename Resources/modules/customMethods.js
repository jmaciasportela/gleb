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

