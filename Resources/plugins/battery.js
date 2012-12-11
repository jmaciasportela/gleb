/**
* Plugin to get battery monitored
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

Ti.API.debug('GLEB - BATTERY - Loading battery plugin');

exports.start= function (){	
	Ti.App.Properties.setString('batteryStatus',"unknow");
	Ti.App.Properties.setInt('batteryLevel', 0);	
	function batteryStateToString(state)
			{
				switch (state)
				{
					case Titanium.Platform.BATTERY_STATE_UNKNOWN:
						return 'unknown';
					case Titanium.Platform.BATTERY_STATE_UNPLUGGED:
						return 'unplugged';
					case Titanium.Platform.BATTERY_STATE_CHARGING:
						return 'charging';
					case Titanium.Platform.BATTERY_STATE_FULL:
						return 'full';
				}
				return '???';
			}	
	batteryEventListener = function(e) {
		Ti.App.Properties.setString('batteryStatus', batteryStateToString(e.state));
		Ti.App.Properties.setInt('batteryLevel', e.level);
	};
	Titanium.Platform.addEventListener('battery', batteryEventListener);
}
