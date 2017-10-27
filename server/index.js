var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var PORT = process.argv[2] || 8000;

app.use(express.static(__dirname + "/public"));
app.get("/addcar",function(request,response) {
  response.writeHead(200);
  response.end();
  var lp = request.url.split("?").slice(1).join("?");
  io.emit("newcar",lp);
});
app.get("/keepalive",function(request,response) {
  response.writeHead(200);
  response.end();
  io.emit("keepalive","");
});

http.listen(PORT,function() {
  console.log("Listening on port " + PORT);
});
