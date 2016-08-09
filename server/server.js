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
            var sendData = {};
            sendData.players = Players.addNewPlayer(data.id, data.name, socket.id);
            playerNum = sendData.players.length;
            console.log('player num is:'+ playerNum);
            io.sockets.emit('players update', sendData);
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
        var sendData = {};
        var role = data.role;
        sendData.role = role;
        sendData.nextPlayer = data.player;
        switch(role){
            case 'Settler': //拓荒者
                sendData.options = Plantation.getPlatationOptions(true);
                //console.log(data.options);
                break;
            case 'Trader'://商人
                //io.sockets.emit('TraderResponse', sendData);
                sendData.tradingHouse = Trading.getTradingHouse();
                break;
            case 'Mayor': //市长
                sendData.colonist = Colonist.allotByPlayer(roundAction, Players.getPlayerNum());
                //io.sockets.emit('MayorResponse', sendData);
                break;
            case 'Captain': //船长
                //io.sockets.emit('CaptainResponse', sendData);
                break;
            case 'Builder'://建筑士
                //io.sockets.emit('BuilderResponse', sendData);
                break;
            case 'Craftsman': //监管
                //io.sockets.emit('CraftsmanResponse', sendData);
                break;
            case 'Prospector'://淘金者
                //io.sockets.emit('ProspectorResponse', sendData);
                break;
        }
        io.sockets.emit('RoleResponse', sendData);
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
        var sendData = {};
        var role = data.role;
        sendData.nextPlayer = Players.nextPlayer(data.player.name);
        console.log('next player will be: '+sendData.nextPlayer.name);

        sendData.role=role;

        switch (role) {
            case 'Settler': //拓荒者
                var plantID = data.index;
                if(plantID != 0){
                    var plant = Plantation.getPlant(plantID);
                    sendData.player = Players.updatePlayer(data.player.name, role, plant);
                }else{
                    sendData.player = null;
                }
                sendData.options = Plantation.updatePlantOptions(plantID);
                //console.log('after plant selected:');
                //console.log(data.options);
                roundAction += 1;
                break;
            case 'Trader'://商人
                //如果玩家没有选择货物交易，则进入下一个玩家
                if(data.product == null){
                    roundAction += 1;
                    break;
                }
                var money = data.product.price;
                sendData.money = money;
                sendData.player = Players.updatePlayer(data.player.id, role, money);
                sendData.result = Trading.inputProduct(data.product);
                if(!sendData.result){
                    io.sockets.emit('result error', data);
                    return;
                }
                sendData.Trading = Trading.getTradingHouse();
                //console.log(data.options);
                roundAction += 1;
                break;
            case 'Mayor': //市长
                //更新每个玩家的buildarea和plantArea
                sendData.player = Players.updatePlayer(data.player.name, role, data.player);
                roundAction += 1;
                //计算下一个玩家的奴隶数
                sendData.colonist = Colonist.allotByPlayer(roundAction, Players.getPlayerNum());
                Players.addColonits(data.player.name, sendData.colonist);
                console.log("Mayor colonist:"+sendData.colonist);
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
                sendData.result = Ships.loadProduct(data.product);
                if(!sendData.result){
                    io.sockets.emit('result error', data);
                    return;
                }
                sendData.points = points;
                sendData.player = Players.addPoints(data.player.id, role, points);
                sendData.Ships = Ships.getShips();
                roundAction += 1;
                break;
            case 'Builder'://建筑士
                var build = Buildings.getBuild(data.indexBuild);
                sendData.player = Players.updateplayer(data.player.id, role, build);
                roundAction += 1;
                break;
            case 'Craftsman': //监管
                sendData.player = Players.updateplayer(data.player.id, role, data.player);
                roundAction += 1;
                break;
            case 'Prospector'://淘金者
        var money = game.getMoney(role);
                sendData.player = Players.updateplayer(data.player.id, role, money);
                roundAction += playerNum;
                break;
        }

        console.log('roundAction:'+roundAction);
        if(roundAction == playerNum){
            if(roundRole == playerNum){
              if(!judgeGameOver()){
                  sendData.ColonistsShip = Colonist.updateShip();
                  console.log('emit : next round');
                  io.sockets.emit('next round', sendData);　//进入下一轮，更换总督玩家
              }
              else{
                  console.log('Game Over!');
              }
            }
            else{
              if(role == 'Mayor'){
                  Colonist.updateRemainder();
                  sendData.ColonistsShip = 0;
              }
              console.log('emit :next role');

              io.sockets.emit('next role', sendData);
            }
        }
        else{
            console.log('emit :'+ (role+'Response'));
            io.sockets.emit((role+'Response'), sendData);
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
