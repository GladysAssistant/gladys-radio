const shared = require('./shared.js');
const Promise = require('bluebird');

module.exports = function(json){
	
	var param = {
		device: {
			name: `New 433Mhz peripheral`,
			protocol: 'radio',
			service: 'radio',
			identifier: json.value
		},
		types: [
			{
				type: 'binary',
				identifier: '',
				sensor: false,
				min: 0,
				max: 1
			}
		]
	};

	var state = {
	  	value: 1
	};
	
	if(json.hasOwnProperty('Addr')) {
		param.device.identifier = (parseInt(json.period/10)*10) + `.` + parseInt(json.Addr) + `.` + parseInt(json.unit);
		param.device.protocol = `DIO`;
		state.value = json.value
	} else {
		param.device.identifier = (parseInt(json.period/10)*10) + `.` + param.device.identifier;
	}
	
	var promise = Promise.resolve();
	

	// if we are in configuration mode, we create the device
	if(shared.isConfModeEnabled()) {
		promise = gladys.device.create(param);
	}

	return promise
		.then(() => gladys.deviceState.createByIdentifier(param.device.identifier, param.device.service, param.types[0].type, state))
		.catch(function(e) {
			sails.log.warn('RadioEmitter error during creation or update of device : ' + e + '.');
			sails.log.warn('Pass to configuration mode if you want to add new devices.');
		});
};
