exports.getStyleView = function(params) {
	var style={};
	style.backgroundColor = params.backgroundColor || "transparent";
	
	//Referenciamos imagenes al resouce directory:
	var RegexUrl = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	if (RegexUrl.test (params.backgroundImage)){
		//Ti.API.debug("GLEB - remote backgroundImage "+params.backgroundImage);
		style.backgroundImage = params.backgroundImage || "";		
	}
	else {
		//Ti.API.debug("GLEB - local backgroundImage "+Titanium.Filesystem.resourcesDirectory+params.backgroundImage);
		style.backgroundImage = Titanium.Filesystem.resourcesDirectory+params.backgroundImage || "";
	}	
			
	style.borderWidth = params.borderWidth || 0;
	style.borderColor = params.borderColor || "#000";
	style.color = params.color || "#000";
	return style;
};

