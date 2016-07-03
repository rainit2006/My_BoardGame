var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var settings = require(__dirname + '/../config/settings');

var Action={//记录玩家的操作
    index_GameItems:null,
    index_Filed:null
};

app.use(express.static(__dirname + '/../client'));

http.listen(settings.port, function() {
      console.log("server listen");
     init();
 })

function init() {

}

io.on('connection', function (socket) {
    console.log('connection.');

    socket.on('submit', function(data){
        Action = data;
        console.log('submit.'+Action.index_GameItems+';'+Action.index_Filed);
        socket.broadcast.emit('update', Action);
    });
});
