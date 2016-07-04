var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var settings = require(__dirname + '/../config/settings');

var Action={//记录玩家的操作
    index_GameItems:null,
    index_Filed:null
};
var players = [];

app.use(express.static(__dirname + '/../client'));

http.listen(settings.port, function() {
      console.log("server listen");
     init();
 })

function init() {
  players = [];
}

io.on('connection', function (socket) {
    console.log('connection.');
    if(players!=null){
        socket.emit('players update', players); //先把当前player列表广播出去
    }

    socket.on('new player add', function (data) {
            // var player = new Object();
            // player.id = data.id;
            // player.socket = socket.id;
            console.log('new player:' + data.name+','+data.id +','+ socket.id);
            players.push(data);
            socket.name = data.name;
            io.sockets.emit('players update', players);
    });

    socket.on('start game', function(){
        io.sockets.emit('start game');
    });

    socket.on('submit', function(data){
        socket.id
        Action = data;
        console.log('submit.'+Action.index_GameItems+';'+Action.index_Filed);
        socket.broadcast.emit('update', data);
    });

    socket.on('disconnect', function(){
        console.log('disconnect: '+socket.name+','+socket.id);
        players.some(function(v, i){
            if (v.name == socket.name){
               players.splice(i,1);
            }
        });
        socket.broadcast.emit('players update', players);
    });
});
