var socket = io();
var LIMIT = 8;
var DICT = {
  "152JK8": "XXIII"
}
var plates = [];
var aliveTick = 1100;

function renderTable() {
  var table = document.getElementById("table");
  while ( table.firstChild ) {
    table.removeChild(table.firstChild);
  }
  var arr = [["#","Name","License Plate"]].concat(plates.map((item,index) => [index + 1,DICT[item] || "Name not found",item]));
  for ( var i = 0; i < arr.length; i++ ) {
    var row = document.createElement("tr");
    var num = document.createElement("td");
    num.innerText = arr[i][0];
    row.appendChild(num);
    var name = document.createElement("td");
    name.innerText = arr[i][1];
    row.appendChild(name);
    var lp = document.createElement("td");
    lp.innerText = arr[i][2];
    row.appendChild(lp);
    table.appendChild(row);
  }
}

socket.on("newcar",function(plate) {
  var plate_dict = Object.keys(DICT);
  for ( var i = 0; i < plate_dict.length; i++ ) {
    var count = 0;
    for ( var j = 0; j < plate.length; j++ ) {
      if ( plate_dict[i].charAt(plate.charAt(j)) > -1 ) count++;
    }
    if ( count / plate_dict[i].length >= 0.6 ) {
      plate = plate_dict[i];
      break;
    }
  }
  if ( plates.indexOf(plate) <= -1 ) {
    if ( plates.length >= LIMIT ) {
      plates = [];
    }
    plates.push(plate);
    renderTable();
  }
});

socket.on("keepalive",function() {
  aliveTick = 1100;
});

window.onload = function() {
  setInterval(function() {
    aliveTick--;
    document.getElementById("error").innerText = aliveTick < 0 ? "ERR_NO_KEEP_ALIVE_HEADER : Client is not online" : "";
  },1);
  renderTable();
};
