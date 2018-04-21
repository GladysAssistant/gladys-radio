var connect = require('./connect.js');
var Promise = require('bluebird');

var ports = [];
var confEnabled = false;

module.exports = {

  addPort: function (newPort)  {
    ports.push(newPort);
  },

  getPorts: function () {
    return ports;
  },

  isConfModeEnabled: function () {
    return confEnabled;
  },

  enableConfMode: function () {
    confEnabled = true;
    sails.log.info('Radio : Configuration mode is now activated during 5 minutes.');
    sails.log.info('Radio : You can now send press your 433mhz remote control to see your periphal in Gladys.');
  },

  disableConfMode: function () {
    confEnabled = false;
    sails.log.info('Radio : Configuration mode is now desactivated.');
  },

  reset: function () {

    // we close all connections
    return Promise.map(ports, function (port) {
        return closeConnection(port);
      })
      .then(() => {

        // then we reset ports variable
        ports = [];
      })
  }
};

function closeConnection(port) {
  return new Promise(function (resolve, reject) {
    port.close(function () {
      resolve();
    });
  });
}
