var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var game = require('./game.js');
var Plantation = require('./Plantation');
var Colonist = require('./Colonist');
var Trading = require('./Trading');
var Building = require('./Building');
var Ships = require('./Ship');
var Players=require('./Player');


var settings = require(__dirname + '/../config/settings');

var GameItemsArray = [];
var FiledArray = [];
var FiledLength = 10;
var Action={//记录玩家的操作
    index_GameItems:null,
    index_Filed:null,
    id:null
};
var playerNum = 1;
var round = 0;
var roundAction = 0; //记录每轮里操作的玩家数，当操作过的玩家数等于玩家总数，则开始进入选角阶段。
var roundRole = 0; //记录选角色的玩家数


app.use(express.static(__dirname + '/../client'));

http.listen(settings.port, function() {
      console.log("server listen");
     init();
 })

function init() {
  //根据player个数决定每次开拓者角色时platation tile数量, colonist总数等。

  Players.initPlayers();
  // GameItemsArray = [];
  // GameItemsArray.push(["玉米", 5, 1]); // "1" stands for "Enable".
  // GameItemsArray.push(["咖啡", 9, 1]);
  // GameItemsArray.push(["item3", 3, 1]);
  // GameItemsArray.push(["item4", 3, 0]);

  FiledArray=[];
  for(var i = 0; i < FiledLength; i ++){
      FiledArray.push(["空地", 0, 0 ]); //param： 土地种类，归属者，数量
  }
}

io.on('connection', function (socket) {
    console.log('connection.');

    socket.on('new player add', function (data) {
            // var player = new Object();
            // player.id = data.id;
            // player.socket = socket.id;
            console.log('new player:' + data.name+','+data.id +','+ socket.id);
            var data = Players.addNewPlayer(data.id, data.name, socket.id);
            io.sockets.emit('players update', data);
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
        //为了避免网络不稳定的脱线，只更新online状态而不真正删除。
        var data = Players.offlinePlayer(socket.id);
        socket.broadcast.emit('players update', data);
    });

    ////////game role is selected//////////////
    socket.on('gameRoleSelect', function(data){
        console.log('gameRoleSelect:'+data.role);
        roundAction = 0; //重新记录操作的玩家数
        var data = data;
        var role = data.role;
        switch(role){
            case 'Settler': //拓荒者
                data.options = Plantation.getPlatationOptions(true);
                //console.log(data.options);
                io.sockets.emit('SettlerResponse', data);
                break;
            case 'Trader'://商人
                io.sockets.emit('TraderResponse', data);
                break;
            case 'Mayor': //市长
                io.sockets.emit('MayorResponse', data);
                break;
            case 'Captain': //船长
                io.sockets.emit('CaptainResponse', data);
                break;
            case 'Builder'://建筑士
                io.sockets.emit('BuilderResponse', data);
                break;
            case 'Craftsman': //监管
                io.sockets.emit('CraftsmanResponse', data);
                break;
            case 'Prospector'://淘金者
                io.sockets.emit('ProspectorResponse', data);
                break;
        }
    });

    // socket.on('plant selected', function(data){
    //     var index = data.index;
    //     data.options = Plantation.updatePlantOptions(index);
    //     Players.updatePlayer(data.player, 'Settler', index);
    //
    //
    //     console.log('after plant selected:'+data.options);
    //     roundAction += 1;
    //     if(roundAction == playerNum){
    //         if(roundRole == playerNum){
    //             io.sockets.emit('next round');　//进入下一轮，更换总督玩家
    //         }
    //         else{
    //
    //             console.log('test:'+Players.testPlantsNum());
    //             io.sockets.emit('next role');
    //         }
    //     }
    //     else{
    //         Plantation.updateNum();
    //         io.sockets.emit('next player action', data);
    //     }
    // });

    socket.on('player select', function(data){
        var role = data.role;
        switch (role) {
            case 'Settler': //拓荒者
                var index = data.index;
                data.options = Plantation.updatePlantOptions(index);
                var plant = Plantation.getPlant(index);
                data.player = Players.updatePlayer(data.player.id, role, plant);

                console.log('after plant selected:'+data.options);
                roundAction += 1;
                break;
            case 'Trader'://商人
                //如果玩家没有选择货物交易，则进入下一个玩家
                if(data.product == null){
                    roundAction += 1;
                    break;
                }
                var money = data.product.price;
                data.money = money;
                data.player = Players.updatePlayer(data.player.id, role, money);
                data.result = Trading.inputProduct(data.product);
                if(!data.result){
                    io.sockets.emit('result error', data);
                    return;
                }
                data.Trading = Trading.getTradingHouse();
                //console.log(data.options);
                roundAction += 1;
                break;
            case 'Mayor': //市长
                //更新每个玩家的buildarea和plantArea
                data.player = Players.updatePlayer(data.player.id, role, data.player);
                roundAction += 1;
                break;
            case 'Captain': //船长
                //船长的次数轮回要等玩家没有货物放到船上时，才算结束
                if(data.product == null){
                    roundAction +=1;
                    break;
                }
                var points = 0;
                for(var i=0; i< data.product.length; i++){
                      points += 1;
                }
                data.result = Ships.loadProduct(data.product);
                if(!data.result){
                    io.sockets.emit('result error', data);
                    return;
                }
                data.points = points;
                data.player = Players.addPoints(data.player.id, role, points);
                data.Ships = Ships.getShips();
                roundAction += 1;
                break;
            case 'Builder'://建筑士
                var build = Buildings.getBuild(data.indexBuild);
                data.player = Players.updateplayer(data.player.id, role, build);
                roundAction += 1;
                break;
            case 'Craftsman': //监管
                data.player = Players.updateplayer(data.player.id, role, data.player);
                roundAction += 1;
                break;
            case 'Prospector'://淘金者
                var money = data.money;
                data.player = Players.updateplayer(data.player.id, role, money);
                roundAction += playerNum;
                break;
        }
        if(roundAction == playerNum){
            if(roundRole == playerNum){
              if(!judgeGameOver()){
                  data.ColonistsShip = Colonist.updateShip();
                  io.sockets.emit('next round');　//进入下一轮，更换总督玩家
              }
              else{
                  console.log('Game Over!');
              }
            }
            else{
                console.log('test:'+Players.testPlantsNum());
                io.sockets.emit('next role');
            }
        }
        else{
            io.sockets.emit('next player action', data);
        }
    });

});

function judgeGameOver(remainder){
   if(remainder <= 0){
      return true;
   }
   else{
      return false;
   }
}
