var SerialPort = require('serialport');
var Promise = require('bluebird');
var connect = require('./connect.js');
var shared = require('./shared.js');

module.exports = function() {

  // first, we list all connected USB devices
  return listUsbDevices()
    .then((ports) => {

      return gladys.user.getAdmin()
        .then((admins) => {

          var arduinos = ports.filter((port) => (port.manufacturer && port.manufacturer.toLowerCase().search("arduino") != -1) || (port.serialNumber && port.serialNumber.toLowerCase().search("cp2102_usb_to_uart_bridge_controller") != -1));
          
          return Promise.map(admin, function(admin) {
            sails.log.info(`List of available connected Arduinos(pick the name of the one with Radio Emitter and put it -as it is- in the Radio_tty variable on Gladys):`);
            return gladys.message.send({id: null}, {text:  `List of available connected Arduinos(pick the name of the one with Radio Emitter and put it -as it is- in the Radio_tty variable on Gladys):`, receiver: admin.id})
              .then(() => 
                Promise.map(arduinos, function(arduino) {
                  sails.log.info(`-` + arduino.comName);
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