var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var settings = require(__dirname + '/../config/settings');

var GameItemsArray = [];
var FiledArray = [];
var FiledLength = 10;
var Action={//记录玩家的操作
    index_GameItems:null,
    index_Filed:null,
    id:null
};
var players = [];

app.use(express.static(__dirname + '/../client'));

http.listen(settings.port, function() {
      console.log("server listen");
     init();
 })

function init() {
  players = [];

  GameItemsArray = [];
  GameItemsArray.push(["玉米", 5, 1]); // "1" stands for "Enable".
  GameItemsArray.push(["咖啡", 9, 1]);
  GameItemsArray.push(["item3", 3, 1]);
  GameItemsArray.push(["item4", 3, 0]);

  FiledArray=[];
  for(var i = 0; i < FiledLength; i ++){
      FiledArray.push(["空地", 0, 0 ]); //param： 土地种类，归属者，数量
  }
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
        Action = data;
        i = Action.index_GameItems;
        j = Action.index_Filed;
        GameItemsArray[i][1] = GameItemsArray[i][1] - 1;
        FiledArray[j][0] = GameItemsArray[i][0];
        FiledArray[j][0] = Action.id;
        console.log('submit.'+Action.index_GameItems+';'+Action.index_Filed);
        io.sockets.emit('update', data);
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
