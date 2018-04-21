var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var shared = require('./shared.js');
var parseData = require('./parseData.js');
var Promise = require('bluebird');

module.exports = function () {

  return gladys.param.getValue('RADIO_TTY')
    .then((value) => {
      sails.log.info(`Radio : Trying to connect to Arduino on port ${value}.`);

      // we connect to the device
      var port = new SerialPort(value, {
        baudRate: 9600,
        parser: serialport.parsers.readline('\n')
      });

      port.on('error', function (err) {
        sails.log.warn('Radio : serial error : ', err.message);
      });

      // if we receive data, we parse it
      port.on('data', parseData);

      port.on('open', function () {
        // open logic
        sails.log.info(`Radio : Serial port opened, connected to arduino on port ${value}`);
      });

      // we add the port object to the shared list
      shared.addPort(port);

      return port;
    });
};
