/**
* Plugin to get battery monitored
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

exports.contains = function(key) {
    var n = JSON.parse(Ti.App.Properties.getString('dailyNotifications'));
    Ti.API.debug('GLEB - DATA - finding Key: '+ key);
    if (n.hasOwnProperty(key)) {
        Ti.API.debug('GLEB - DATA - contains: True');   
        return true;
    }
    else {
        Ti.API.debug('GLEB - DATA - contains: False');
        return false;
    }
}

exports.push = function(key) {
    var n = JSON.parse(Ti.App.Properties.getString('dailyNotifications'));
    n[key] = "saved";
    Ti.App.Properties.setObject('dailyNotifications', n);   
    return true;
}

exports.clean = function() {
    Ti.App.Properties.removeProperty('dailyNotifications');
}