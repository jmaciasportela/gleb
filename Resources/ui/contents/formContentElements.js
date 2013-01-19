// Content View mapea los elementos del JSON a elementos UI de Titanium

// "Constants"
exports.TYPE_DATE = 'date';
exports.TYPE_EMAIL = 'email';
exports.TYPE_NUMBER = 'number';
exports.TYPE_PASSWORD = 'password';
exports.TYPE_PHONE = 'phone';
exports.TYPE_PICKER = 'picker';
exports.TYPE_TEXT = 'text';
exports.TYPE_SUBMIT = 'submit';

var isAndroid = Ti.Platform.osname === 'android';

var offsetTop = Ti.App.glebUtils._p(0);
var heightLabel = 20;
var heightTextField = 30;
var heightPicker = 30;
var heightDate = 140;
var heightCheckBox = 40;
var heightButton = 60;
var distance = 10;


var keyboardMap = {};
keyboardMap[exports.TYPE_EMAIL] = Ti.UI.KEYBOARD_EMAIL;
keyboardMap[exports.TYPE_NUMBER] = Ti.UI.KEYBOARD_NUMBER_PAD;
keyboardMap[exports.TYPE_PASSWORD] = Ti.UI.KEYBOARD_DEFAULT;
keyboardMap[exports.TYPE_PHONE] = Ti.UI.KEYBOARD_NUMBER_PAD;
keyboardMap[exports.TYPE_TEXT] = Ti.UI.KEYBOARD_DEFAULT;

var setupPickerTextField = function(textField, pickerType, data) {
    textField.editable = false;
    textField.rightButton = Ti.UI.createButton({
        style: Ti.UI.iPhone.SystemButton.DISCLOSURE,
        transform: Ti.UI.create2DMatrix().rotate(90)
    });
    textField.rightButtonMode = Ti.UI.INPUT_BUTTONMODE_ALWAYS;
    
    textField.addEventListener('focus', function(e) {
        e.source.blur(); 
        require('ui/utils/semiModalPicker').createSemiModalPicker({
            textField: textField,
            value: textField.value,
            type: pickerType,
            data: data
        }).open({animated:true});
    });
};

var insertTitle = function(title) {

    var titleFields = Ti.UI.createLabel({
        name: title,
        text: title,
        top: offsetTop,
        height: Ti.App.glebUtils._p(heightLabel),
        width: Ti.App.glebUtils._p(250),
        font: {
            fontSize: '12dp',
            fontWeight: 'bold'
        },  
        color:"#000"
    });     
    
    offsetTop += Ti.App.glebUtils._p(heightLabel+5);        
    return titleFields;
};

var validateTextField = function(result) {

    var bResult = true; 
    
    for(i=0;i<result.length;i++){
        Ti.API.debug('GLEB FORMULARIO- El tamano de result es: '+result.length);
        var item = result[i];
        //Primero comprobamos que el elemento del formulario es un textField
        if(item.typeField === "textField"){
            //Comprobamos que el campo no esté vacío
            if(item.value === ""){
                var dialog = Ti.UI.createAlertDialog({
                    message: 'Es obligatorio rellenar todos los campos del formulario',
                    ok: 'Aceptar',
                }).show();
                bResult = false;
                break;
            }
            else{
                continue;
            }
        }
    }
    return bResult;
};

exports.formContentView = function(content) {
    var result=[];  
    var style = require('ui/styles/styleContent');  
    
    offsetTop = Ti.App.glebUtils._p(0);
    
    Ti.API.debug('GLEB - COMENZAMOS A OBTENER LOS CONTENTS DEL FORMULARIO: ');
    
    // Vamos recorriendo cada elemento content de la vista form
    for (i in content) {
        item=content[i];        
        var localStyle = style.getStyleContent(item.style || {});
        
        switch (item.type)
        {
            case 'label':
            Ti.API.debug('GLEB FORMULARIO - LABEL');
                label = Ti.UI.createLabel({
                        name: item.name,
                        text: item.labelH1,
                        top: offsetTop,
                        height: Ti.App.glebUtils._p(heightLabel),
                        width: Ti.App.glebUtils._p(250),    
                        font:{fontSize: '12dp', fontStyle: localStyle.labelH1Style, fontWeight: localStyle.labelH1Weight},
                        color: localStyle.labelH1Color,             
                        backgroundColor: localStyle.backgroundColor,
                        typeField: item.type
                });     
                
                offsetTop += Ti.App.glebUtils._p(heightLabel+distance);     
                result.push(label);
                break;
                
            case 'textField':
                Ti.API.debug('GLEB FORMULARIO - TEXTFIELD');
                
                result.push(insertTitle(item.name));    
                
                textField = Ti.UI.createTextField({
                        name: item.name,
                        title: item.name,
                        value:item.defaultValue,
                        top: offsetTop,
                        height: Ti.App.glebUtils._p(heightTextField),
                        width: Ti.App.glebUtils._p(250),
                        verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,  
                        color:"#000",   
                        font:{fontSize: '12dp'},        
                        backgroundColor: localStyle.backgroundColor,
                        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
                        keyboardType: keyboardMap[item.dataType],
                        passwordMask: item.dataType === exports.TYPE_PASSWORD,
                        typeField: item.type
                    }); 
                
                Ti.API.debug('GLEB FORMULARIO- Cada textField antes del result : '+JSON.stringify(textField));
                offsetTop += Ti.App.glebUtils._p(heightTextField+distance);
                result.push(textField);
                break;
            
            /*
            //PROBLEMA CON EL PICKER, YA QUE LAS OPCIONES SALEN DETRAS DE LA VENTANA PRINCIPAL Y NO SE LE MUESTRAN AL USUARIO
            case 'select':
                Ti.API.debug('GLEB FORMULARIO - SELECT');
                
                result.push(insertTitle(item.name));
                
                if (isAndroid) {
                    
                    picker = Ti.UI.createPicker({
                        name: item.name,
                        top: offsetTop,
                        height: Ti.App.glebUtils._p(heightPicker),
                        width: Ti.App.glebUtils._p(250),
                        type: Ti.UI.PICKER_TYPE_PLAIN,
                        width: "auto",
                        typeField: item.type
                    });
                    for (var i in item.options) {
                        picker.add(Ti.UI.createPickerRow({title:item.options[i]})); 
                    }
                    picker.selectionIndicator = true;
                    picker.setSelectedRow(0, item.defaultValue, false);
                       picker.addEventListener('change',function(e){
                            alert("User selected: " + e.row.title);
                        });
                } else {
                    picker = Ti.UI.createTextField(textFieldDefaults);
                    picker.typeField = item.type;
                    picker.name = item.name;
                    setupPickerTextField(picker, Ti.UI.PICKER_TYPE_PLAIN, item.options);
                }
                
                offsetTop += Ti.App.glebUtils._p(heightPicker+distance);
                result.push(picker);
                break;
            */
                
            case 'date':
                Ti.API.debug('GLEB FORMULARIO - DATE');
                
                result.push(insertTitle(item.name));
                
                if (isAndroid) {
                    picker = Ti.UI.createPicker({
                        name: item.name,
                        top: offsetTop,
                        height: Ti.App.glebUtils._p(heightDate),
                        width: Ti.App.glebUtils._p(250),
                        type: Ti.UI.PICKER_TYPE_DATE,
                        minDate: new Date(2009,0,1),
                        maxDate: new Date(2014,11,31),
                        value:new Date(),
                        selectionIndicator: true,
                        typeField: item.type
                    });
                    
                    picker.addEventListener('change', function(e){
                        picker.value = e.value;
                    });
        
                } else {
                    picker = Ti.UI.createTextField(textFieldDefaults);
                    setupPickerTextField(picker, Ti.UI.PICKER_TYPE_DATE);
                }
                
                offsetTop += Ti.App.glebUtils._p(heightDate+distance);
                result.push(picker);
                break;
            
            //TODO 
            case 'checkBox':
                Ti.API.debug('GLEB FORMULARIO - CHECKBOX');
                if (isAndroid) {
                    var checkBox = Ti.UI.createSwitch({
                        name: item.name,
                        style: Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
                        textAlign:Ti.UI.TEXT_ALIGNMENT_LEFT,
                        top: offsetTop,
                        height: Ti.App.glebUtils._p(heightTextField),
                        width: Ti.App.glebUtils._p(250),
                        title:item.labelH1,
                        font:{fontSize: '12dp', fontStyle: localStyle.labelH1Style, fontWeight: localStyle.labelH1Weight},
                        color: localStyle.labelH1Color, 
                        value:true,
                        typeField: item.type
                    });
                    
                    checkBox.addEventListener('change',function(e){
                        Ti.API.info('Switch value: ' + checkBox.value);
                    });
                } else {
                    var checkbox = Ti.UI.createButton({
                        name: item.name,
                        title: item.labelH1,
                        top: offsetTop,
                        height: Ti.App.glebUtils._p(heightTextField),
                        width: Ti.App.glebUtils._p(250),
                        borderColor: '#666',
                        borderWidth: 2,
                        borderRadius: 15,
                        color: localStyle.labelH1Color,
                        font:{fontSize: '12dp', fontStyle: localStyle.labelH1Style, fontWeight: localStyle.labelH1Weight},
                        value: false, //value is a custom property in this case here
                        typeField: item.type
                    });
                     
                    //Attach some simple on/off actions
                    checkbox.on = function() {
                        this.backgroundColor = '#159902';
                        this.value = true;
                    };
                     
                    checkbox.off = function() {
                        this.backgroundColor = '#aaa';
                        this.value = false;
                    };
                     
                    checkbox.addEventListener('click', function(e) {
                        if(false == e.source.value) {
                            e.source.on();
                        } else {
                            e.source.off();
                        }
                    });
                }
                
                offsetTop += Ti.App.glebUtils._p(heightCheckBox+distance);
                result.push(checkBox);
                break;
                
            
            case 'button':
                Ti.API.debug('GLEB FORMULARIO - BUTTON');
                button = Ti.UI.createButton({
                        name: item.name,
                        title:item.labelH1,
                        text: item.labelH1,
                        top: offsetTop,
                        bottom: Ti.App.glebUtils._p(distance),
                        height: Ti.App.glebUtils._p(heightButton),
                        width: Ti.App.glebUtils._p(120),    
                        font:{fontSize: '16dp', fontStyle: localStyle.labelH1Style, fontWeight: localStyle.labelH1Weight},              
                        color: localStyle.labelH1Color,
                        backgroundColor: localStyle.backgroundColor,
                        borderColor: 'black',
                        borderWidth: 1,
                        borderRadius: 2,
                        url: item.url || require("clients/glebAPI.config").sendForm_url,
                        typeField: item.type
                    });     
                                        
                button.addEventListener('click', function(e){
                    //Primero validamos la informacion de los campos del formulario y
                    //luego enviamos la información al server          
                    Titanium.Media.vibrate([ 0, 100]);
                    if(validateTextField(result)){
                        //Se envía el formulario al server mediante un POST
                        Ti.App.glebUtils.closeActivityIndicator();
                        Ti.App.glebUtils.openActivityIndicator({"text":"Enviando formulario ..."});
                        Ti.API.info("GLEB - Enviando datos del formulario al GLEB server");
                        require("clients/glebAPI").sendForm(result);
                    }
                });
                
                offsetTop += Ti.App.glebUtils._p(heightButton+distance);
                result.push(button);
                break;
                
            default:
                Ti.API.error("Unsupported view content type="+item.type);
        }

    }
    return result;
};