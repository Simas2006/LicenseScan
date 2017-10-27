var alpr = require("node-openalpr");
var webcam = require("node-webcam");
var request = require("request");
var OPTIONS = {
    width: 1280,
    height: 720,
    quality: 100,
    delay: 0,
    saveShots: true,
    output: "jpeg",
    device: false,
    verbose: false
};
var ADDRESS = "http://127.0.0.1:8000";
alpr.Start();

function checkPlate() {
  var camobj = webcam.create(OPTIONS);
  camobj.capture(__dirname + "/img.jpg",function(err,data) {
    alpr.IdentifyLicense("img.jpg",function(err,output) {
      if ( err ) throw err;
      var plates = output.results.filter(item => item.confidence >= 80).map(item => item.plate);
      if ( plates.length > 0 ) {
        request(ADDRESS + "/addcar?" + plates[0],function(err,response,body) {
          if ( err ) throw err;
        });
      }
    });
  });
}

setInterval(checkPlate,1000); // change this!
setInterval(function() {
  request(ADDRESS + "/keepalive",function(err,response,body) {
    if ( err ) throw err;
  });
},1000);
