var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var game = require('./game.js');
var Plantation = require('./Plantation');
var Colonist = require('./Colonist');
var Trading = require('./Trading');
var Buildings = require('./Building');
var Ships = require('./Ship');
var Players=require('./Player');


var settings = require(__dirname + '/../config/settings');

var GameItemsArray = [];
// var FiledArray = [];
// var FiledLength = 10;
// var Action={//记录玩家的操作
//     index_GameItems:null,
//     index_Filed:null,
//     id:null
// };
var BuildingAreaMaxNum = 12;
var PlantationAreaMaxNum = 12;
var playerNum = 1;
var round = 0;
var roundAction = 0; //记录每轮里操作的玩家数，当操作过的玩家数等于玩家总数，则开始进入选角阶段。
var roundRole = 0; //记录选角色的玩家数
var captainRound = 0; //记录船长角色中load货物的玩家数。当玩家数等于总数时，开始清理玩家手里的货物。
var rolePlayer;
var govenor;
var gameOver = false;


app.use(express.static(__dirname + '/../client'));

http.listen(settings.port, function() {
      console.log("server listen");
      Players.initPlayers();
      init();
 })

function init() {
  //根据player个数决定每次开拓者角色时platation tile数量, colonist总数等。
  game.init();
  Buildings.iniBuildings();
  Ships.initShips();
  Trading.init();
  Plantation.init();
  Colonist.init(playerNum);
  round = 0;
  roundRole = 0;
  roundAction = 0;
  captainRound = 0;
  gameOver = false;
}

io.on('connection', function (socket) {
    console.log('connection.');

    socket.on('new player join', function (data) {
        // var player = new Object();
        // player.socket = socket.id;
        console.log('new player:' + data+','+ socket.id);
        socket.name = data;
        var sendData={};
        sendData.players = Players.addNewPlayer(data, socket.id);


        playerNum = sendData.players.length;
        console.log('player num is:'+ playerNum);
        io.sockets.emit('players update', sendData);
    });

    socket.on('start game', function(){
        Players.resetPlayers();
        init();
        var sendData = {};
        ////传递一些游戏初始状态/
        sendData.ships = Ships.getShips();
        sendData.tradingHouse = Trading.getTradingHouse();
        sendData.buildingsNum = Buildings.getBuildingsNum();
        sendData.players = Players.getPlayers();
        sendData.colonistsShip = Colonist.getShip();
        sendData.colonistsNum = Colonist.getColonistsNum();
        sendData.roles = game.getAllRoles();

        govenor = Players.initGovenor();
        rolePlayer = govenor;
        sendData.rolePlayer = govenor;

        sendData.messages = [];
        var message = "<li class='message'><span class='messageGameEvent'>Game start！</span></li>";
        sendData.messages.push(message);
        message = "<li class='message'><span class='messageNewRound'>总督是："+govenor+"。请"+govenor+"选择角色。</span></li>";
        sendData.messages.push(message);

        io.sockets.emit('start game', sendData);
    });

    socket.on('submit', function(data){
        Action = data;
        i = Action.index_GameItems;
        j = Action.index_Filed;
        GameItemsArray[i][1] = GameItemsArray[i][1] - 1;
        FiledArray[j][0] = GameItemsArray[i][0];
        FiledArray[j][0] = Action.id;
        //console.log('submit.'+Action.index_GameItems+';'+Action.index_Filed);
        io.sockets.emit('update', data);
    });

    socket.on('disconnect', function(){
        console.log('disconnect: '+socket.name+','+socket.id);
        //为了避免网络不稳定的脱线，只更新online状态而不真正删除。
        var sendData = {};
        sendData.players = Players.offlinePlayer(socket.id);
        socket.broadcast.emit('players update', sendData);
    });

    ////////game role is selected//////////////
    socket.on('gameRoleSelect', function(data){
        if(gameOver){
          return;
        }
        console.log('gameRoleSelect:'+data.role);
        roundAction = 0; //重新记录操作的玩家数
        captainRound = 0;
        roundRole += 1;
        var sendData = {};
        sendData.messages = [];

        Players.setRolePayerName(data.player.name);

        var role = data.role;
        sendData.role = role;
        var messageString = data.player.name+"选择的角色是："+role+"。";
        sendData.messages.push(message);

        var money = game.getRoleMoney(role);
        if(money > 0){
            Players.addMoney(data.player.name, money);
            messageString += data.player.name+"获得了："+money+"个金币。";
        }
        sendData.messages.push("<li class='message'><span class='messageRole'>"+messageString+"</span></li>");
        game.disactiveRole(role);
        sendData.roles = game.getAllRoles();
        sendData.nextPlayer = data.player;

        switch(role){
            case 'Settler': //拓荒者
                sendData.options = Plantation.createPlatationOptions(true);
                //console.log(data.options);
                break;
            case 'Trader'://商人
                //io.sockets.emit('TraderResponse', sendData);
                sendData.tradingHouse = Trading.getTradingHouse();
                break;
            case 'Mayor': //市长
                //var rolePlayer = Players.getRolePayerName();
                //var flag = (data.player.name == rolePlayer);
                var colonist = Colonist.allotByPlayer(roundAction, Players.getPlayerNum(), true);
                var message = "<li class='message'><span class='messageSelect'>"+sendData.nextPlayer.name+"获得"+colonist+"个奴隶.</span></li>";
                sendData.messages.push(message);
                sendData.player = Players.addColonits(data.player.name, colonist, colonist);
                sendData.nextPlayer = sendData.player;
                //console.log("allot colonists:"+sendData.colonist);
                break;
            case 'Captain': //船长
                sendData.ships = Ships.getShips();
                //io.sockets.emit('CaptainResponse', sendData);
                break;
            case 'Builder'://建筑士
                sendData.buildingsNum = Buildings.getBuildingsNum();
                //io.sockets.emit('BuilderResponse', sendData);
                break;
            case 'Craftsman': //监管
                //io.sockets.emit('CraftsmanResponse', sendData);
                break;
            case 'Prospector'://淘金者
                //io.sockets.emit('ProspectorResponse', sendData);
                break;
        }

        sendData.colonistsNum = Colonist.getColonistsNum();
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
        if(gameOver){
          return;
        }
        var sendData = {};
        sendData.rolePlayer = rolePlayer;
        sendData.messages = [];
        var role = data.role;

        if(data.messages != null){
            sendData.messages = data.messages;
        }
        sendData.nextPlayer = Players.nextPlayer(data.player.name);
        sendData.role=role;
        switch (role) {
            case 'Settler': //拓荒者
                if(data.index == null){
                    roundAction +=1;
                    sendData.options = Plantation.updatePlantationOptions(0);
                    sendData.messages.push("<li class='message'><span class='messageSelect'>"+data.player.name+"放弃了选择。</span></li>");
                    break;
                }

                Plantation.takeoutPlant(data.index);
                var plant = Plantation.getPlant(data.index);
                var messageString = data.player.name+"选择了"+plant.name+"。";

                //如果玩家拥有【收容所】，则可以自动获得一个拓荒者.
                if(containBuilding(data.player, 'hospice')){
                  var result = Colonist.takeoutColonist();
                  if( result >= 0){
                    plant.actualColonist += 1;
                    Players.addColonits(data.player.name, 1, 0);
                    messageString += data.player.name+"因为有【收容所】所以同时获得一个开拓者。";

                    if(result == 1){
                      sendData.colonist = Colonist.getShip();
                    }
                  }
                }
                Players.updatePlayer(data.player.name, role, plant);

                if(data.extraIndex != null){
                    Plantation.takeoutPlant(data.extraIndex);
                    var plant1 = Plantation.getPlant(data.extraIndex);
                    sendData.player = Players.updatePlayer(data.player.name, role, plant1);
                    messageString += data.player.name+"因为有【农庄】所以额外获得一个"+plant1.name+"。";
                }

                sendData.options = Plantation.updatePlantationOptions(plant.id);
                //console.log('after plant selected:');
                //console.log(data.options);
                sendData.messages.push("<li class='message'><span class='messageSelect'>"+messageString+"</span></li>");
                roundAction += 1;
                break;
            case 'Trader'://商人
                //如果玩家没有选择货物交易，则进入下一个玩家
                if(data.product == null){
                    roundAction += 1;
                    sendData.player = null;
                    sendData.tradingHouse = Trading.getTradingHouse();
                    var message = "<li class='message'><span class='messageSelect'>"+data.player.name+"放弃了交易.</span></li>";
                    sendData.messages.push(message);
                    break;
                }
                var money = data.product.price;
                if(data.player.name == rolePlayer){
                    money += 1;
                }
                ////拥有小市场大厅，则多卖1金币
                if(containBuilding(data.player, 'small market')){
                    money += 1;
                }
                ////拥有大市场大厅，则多卖2金币
                if(containBuilding(data.player, 'large market')){
                    money += 2;
                }
                Players.updatePlayer(data.player.name, role, [money, data.product.id]);
                var message = "<li class='message'><span class='messageSelect'>"+data.player.name+"贩卖了"+data.product.name+". 共获得了"+money+"金币. </span></li>";
                sendData.messages.push(message);

                sendData.result = Trading.inputProduct(data.product);
                if(!sendData.result){
                    io.sockets.emit('result error', data);
                    return;
                }
                sendData.tradingHouse = Trading.getTradingHouse();
                //console.log(data.options);
                roundAction += 1;
                break;
            case 'Mayor': //市长
                //更新每个玩家的buildarea和plantArea
                Players.updatePlayer(data.player.name, role, data.player);

                roundAction += 1;
                //计算下一个玩家的奴隶数
                if(roundAction < playerNum){
                    var colonist = Colonist.allotByPlayer(roundAction, Players.getPlayerNum(), false);
                    sendData.nextPlayer = Players.addColonits(sendData.nextPlayer.name, colonist, colonist);
                    //console.log("Mayor colonist:"+colonist);
                    var message = "<li class='message'><span class='messageSelect'>"+sendData.nextPlayer.name+"获得了"+colonist+"个奴隶. </span></li>";
                    sendData.messages.push(message);
                }
                break;
            case 'Captain': //船长
                //货物清除阶段时，只传递message
                if(data.productClear){
                    sendData.messages = data.messages;
                    if(data.player != null){
                        Players.overwritePlayer(data.player);
                    }
                    sendData.player = data.player;
                    //console.log("captain product clear.");
                    //console.log(data.player);
                    roundAction += 1;
                    break;
                }
                //船长的次数轮回要等玩家没有货物放到船上时，才算结束
                if(data.product == 'none'){
                    captainRound +=1;
                    var message = "<li class='message'><span class='messageSelect'>"+data.player.name+"没有可以装载的货物了. </span></li>";
                    sendData.messages.push(message);
                    break;
                }
                //console.log(data.product);
                var plant = Plantation.getPlant(data.product);
                if(data.ship != null){
                    sendData.result = Ships.loadProduct(data.ship, plant.name, data.productNum);
                }
                sendData.ships = Ships.getShips();
                // if(!sendData.result){
                //     console.log('err: captian loadproduct failed!');
                //     io.sockets.emit('result error', data);
                //     return;
                // }
                var points = data.productNum;
                if(Players.getRolePayerName() == data.player.name){
                  points += 1;
                  Players.clearRolePayerName();
                }
                if(containBuilding(data.player, 'harbor')){
                  points += 1;
                  // player.id = data.id;
                }
                Players.updatePlayer(data.player.name, role, [plant.id, data.productNum, points]);
                if(data.wharf != null){
                    var message = "<li class='message'><span class='messageSelect'>"+data.player.name+"装载了"+data.productNum+"个"+plant.name+"到【船坞船】. 获得了"+points+"个point.</span></li>";
                    sendData.messages.push(message);
                }else if(data.ship != null){
                    var message = "<li class='message'><span class='messageSelect'>"+data.player.name+"装载了"+data.productNum+"个"+plant.name+"到运输船#"+data.ship+", 获得了"+points+"个point.</span></li>";
                    sendData.messages.push(message);
                }
                break;
            case 'Builder'://建筑士
                if(data.build == null){
                    roundAction +=1;
                    sendData.messages.push("<li class='message'><span class='messageSelect'>"+data.player.name+"没有选择任何建筑。</span></li>");
                    break;
                }
                var build = Buildings.takeoutBuild(data.build);
                var messageString = data.player.name+"选择了"+build.name+"。";
                if(containBuilding(data.player, 'university')){
                  var result = Colonist.takeoutColonist();
                  if( result >= 0){
                    build.actualColonist += 1;
                    Players.addColonits(data.player.name, 1, 0);
                    messageString += data.player.name+"因为拥有【大学】所以同时获得了一个开拓者。";
                    if(result == 1){
                      sendData.colonist = Colonist.getShip();
                    }
                  }
                }
                Players.updatePlayer(data.player.name, role, [build, data.price]);
                sendData.buildingsNum = Buildings.getBuildingsNum();
                sendData.messages.push("<li class='message'><span class='messageSelect'>"+messageString+"</span></li>");
                roundAction += 1;
                break;
            case 'Craftsman': //监管
                Players.updatePlayer(data.player.name, role, data.player);
                var corn = data.player.products[0];
                var sugar = data.player.products[1];
                var indigo = data.player.products[2];
                var tobacco = data.player.products[3];
                var coffee = data.player.products[4];
                var messageString = data.player.name+"已拥有："+corn+"个玉米，"+sugar+"个白糖，"+indigo+"个靛蓝，"+tobacco+"个烟草，"+coffee+"个咖啡。";

                if(containBuilding(data.player, 'factory')){
                    var addProducts = data.addProducts;
                    var number = 0;
                    $.each(addProducts, function(index){
                        if(addProducts[index] > 0){
                            number += 1;
                        }
                    });
                    var moeny = 0;
                    switch(number){
                      case 2:
                        money = 1;
                        break;
                      case 3:
                        money =2;
                        break;
                      case 4:
                        money = 3;
                        break;
                      case 5:
                        money = 5;
                        break;
                      default:
                        money = 0;
                        break;
                    }
                    if(money > 0){
                        messageString += data.player.name+"因为拥有【工厂】，所以根据生产货物的种类，额外获得"+money+"个金币。";
                    }
                }


                sendData.messages.push("<li class='message'><span class='messageSelect'>"+messageString+"</span></li>");
                roundAction += 1;
                break;
            case 'Prospector'://淘金者
                Players.updatePlayer(data.player.name, role, 1);
                var message = "<li class='message'><span class='messageSelect'>"+data.player.name+"获得了1个金币. </span></li>";
                sendData.messages.push(message);
                roundAction = playerNum;
                break;
        }

        //取得最新状态的player
        sendData.player = Players.getPlayerByName(data.player.name);
        ///再次重新计算next player，以便得到最新的next player数据
        sendData.nextPlayer = Players.nextPlayer(data.player.name);
        console.log('next player will be: '+sendData.nextPlayer.name);
        //更新剩余开拓者数目
        sendData.colonistsNum = Colonist.getColonistsNum();

        //console.log('roundAction:'+roundAction+'; captainRound:'+captainRound);
        if((role == 'Captain')&&(captainRound >= playerNum)){
            sendData.productClear = true;
            //console.log("set data.productClear as true");
        }
        if(roundAction >= playerNum){
            if(roundRole >= playerNum){
              if(!judgeGameOver()){
                  roundRole = 0;
                  sendData.role = 'none';
                  sendData.players = Players.getPlayers();
                  sendData.colonistsShip = Colonist.updateShip(sendData.players);
                  sendData.ships = Ships.updateShips();
                  sendData.colonistsNum = Colonist.getColonistsNum();

                  game.allotMoneyForRoles();
                  game.activeAllRoles();
                  sendData.roles = game.getAllRoles();
                  var messageString = "</span></li>";

                  var nextPlayer = Players.nextPlayer(govenor);
                  govenor = nextPlayer.name;
                  sendData.rolePlayer = govenor;
                  sendData.messages.push("<li class='message'><span class='messageNewRound'>进入下一轮！新的总督是"+govenor+"。请"+govenor+"选择角色。</span></li>");
                  console.log('emit : next round');
                  io.sockets.emit('next round', sendData);　//进入下一轮，更换总督玩家
              }
              else{
                  console.log('Game Over!');
                  gameOver = true;
                  var message = "<li class='message'><span class='messageGameEvent'>Game Over!</span></li>";
                  sendData.messages.push(message);

                  var players = Players.getPlayers();
                  var resultInfo = gameResult();
                  sendData.resultInfo = resultInfo;

                  var messageString = "最终排位是:";
                  for(var i = 0; i < resultInfo.length; i++){
                      var player = resultInfo[i].player;
                      var pointsArray = resultInfo[i].pointsArray;
                      messageString += "No."+(i+1)+":"+player.name+", 总分数"+pointsArray[0];
                  }
                  sendData.messages.push("<li class='message'><span class='messageGameEvent'>"+messageString+"</span></li>");
                  io.sockets.emit('game over', sendData);
              }
            }
            else{
              if(role == 'Mayor'){
                  Colonist.clearShip();
                  sendData.colonistsShip = 0;
              }
              sendData.role = "none";
              var nextPlayer = Players.nextPlayer(rolePlayer);
              sendData.rolePlayer = nextPlayer.name;
              var message = "<li class='message'><span class='messageNewRound'>请"+sendData.rolePlayer+"选择角色."+"</span></li>";
              sendData.messages.push(message);
              console.log('emit :next role');

              io.sockets.emit('next role', sendData);
            }
        }
        else{
            console.log('emit RoleResponse:'+role);
            io.sockets.emit('RoleResponse', sendData);
        }

    });

});

function judgeGameOver(){
   var check = false;
   var remainder = Colonist.getRemainder();
   if(remainder <= 0){
      check = true;
   }

   var players = Players.getPlayers();
   for(var i=0; i<players.length; i++){
      if(Players.getBuildingSpaces(players[i].name) >= BuildingAreaMaxNum){
          check = true;
      }
   }
  return check;

}

function gameResult(){
  var resultInfo = [];
  var players = Players.getPlayers();
  for(var i=0; i< players.length; i++){
      var player = players[i];
      var pointsArray = Players.getPoints(player.name);
      resultInfo.push({player: player, pointsArray:pointsArray});
  }
  resultInfo.sort(compare);
  return resultInfo;
}

function compare(a,b) {
  if (a.pointsArray[0] < b.pointsArray[0])
    return -1;
  if (a.pointsArray[0] > b.pointsArray[0])
    return 1;
  if (a.pointsArray[0] == b.pointsArray[0]){
    var a_money = a.player.money + a.player.product[0]+ a.player.product[1]+ a.player.product[2]+ a.player.product[3]+ a.player.product[4];
    var b_money = b.player.money + b.player.product[0]+ b.player.product[1]+ b.player.product[2]+ b.player.product[3]+ b.player.product[4];

     return a_money-b_money;
  }
  return 0;
}


function containBuilding(player, name){
  var result = false;
  for(var i =0; i<player.buildArea.length; i++){
    if(player.buildArea[i].name == name){
        if(player.buildArea[i].actualColonist == 1){
            result = true;
            return result;
        }
    }
  }
  return result;
}
