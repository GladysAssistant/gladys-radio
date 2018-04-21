const shared = require('./shared.js');
const Bottleneck = require("bottleneck");
 
// Never more than 1 request running at a time.
// Wait at least 50ms between each request.
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 50
});

module.exports = function(code) {
  
  return limiter.schedule(() => new Promise(function(resolve, reject) {

     // geting the first arduino finded on usb
    var ports = shared.getPorts();
    var port = ports[0];

    port.write(code);
    
    resolve();
  }));
};