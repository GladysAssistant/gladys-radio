var SerialPort = require('serialport');
var Promise = require('bluebird');
var connect = require('./connect.js');
var shared = require('./shared.js');
const i18n = require('./i18n');

module.exports = function() {

  // first, we list all connected USB devices
  return listUsbDevices()
    .then((ports) => {

      return gladys.user.getAdmin()
        .then((admins) => {

          var arduinos = ports.filter((port) => (port.manufacturer && port.manufacturer.toLowerCase().search("arduino") != -1) || (port.serialNumber && port.serialNumber.toLowerCase().search("cp2102_usb_to_uart_bridge_controller") != -1));
          
          return Promise.map(admins, function(admin) {
            var message;
            var language = admin.language == 'fr' ? 'fr' : 'en';
            
            if(arduinos.length === 0 ){
              message = i18n[language].noArduinoFounds;
            } else {
              message = i18n[language].arduinosFounds;
            }
            
            sails.log.info(message);
            return gladys.message.send({id: null}, {text:  message, receiver: admin.id})
              .then(() => 
                Promise.map(arduinos, function(arduino) {
                  sails.log.info(`- ` + arduino.comName);
                  return gladys.message.send({id: null}, {text:  `- ` + arduino.comName, receiver: admin.id});
                })
              );
          });
        });
    })
	.then(() => {
		
		// we enable detection
    shared.enableConfMode();
    
		// we wait 5 minutes before stopping detection
    setTimeout(shared.disableConfMode, 5*60*1000);
    
		return Promise.resolve();
	})
};

function listUsbDevices() {
  return new Promise(function(resolve, reject) {
    SerialPort.list(function(err, ports) {
      if (err) return reject(new Error(err));

      return resolve(ports);
    });
  });
}