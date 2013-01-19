/**
* Plugin to control heading
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/


exports.checkAction =function (){
    
Ti.API.debug("GLEB - BOOTACTIONS - Looking for boot actions");

    var db = Ti.Database.install(Titanium.Filesystem.resourcesDirectory+'sql/actions.sqlite','actions');  

    try {
       var rows = db.execute('SELECT * FROM actions');
       Ti.API.debug("GLEB - BOOTACTIONS - rows: "+ rows.getRowCount());
       Ti.API.debug("GLEB - BOOTACTIONS - field: "+ rows.getFieldCount());
    }
    catch (err){
        Ti.API.error("GLEB - BOOTACTIONS - Fail to select db rows");
    }    
    if (rows.isValidRow() && !Ti.App.Properties.getBool('onAction')){
        Ti.App.Properties.setBool('onAction', true);
        Ti.API.debug("GLEB - BOOTACTIONS - pushId: " + rows.fieldByName('pushId'));
        Ti.API.debug("GLEB - BOOTACTIONS - message: " + rows.fieldByName('message'));
        Ti.API.debug("GLEB - BOOTACTIONS - payload: " + rows.fieldByName('payload'));
        Ti.API.debug("GLEB - BOOTACTIONS - serial: " + rows.fieldByName('serial')); 
        require('plugins/pushActions').executeAction(rows.fieldByName('pushId'), rows.fieldByName('message'), rows.fieldByName('payload'), rows.fieldByName('serial'));
    }
    rows.close();
    db.close();
}

