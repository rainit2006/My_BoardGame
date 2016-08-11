//var Plants = require('./Plantation');
//var Buildings = require('./Building');


var Players = [];
var playerNum = 0;
var playerOnlineNum = 0;
var rolePlayerName = "";

exports.initPlayers = function(){
    Players = [];
}

exports.resetPlayers= function(){
   if(Players == null){
     return;
   }
   for(var i=0; i < Players.length; i++){
      var player = Players[i];
      player.points=0;
      player.totalColonists=0;
      player.freeColonists=0;
      player.money=0;
      player.quarry=0;
      // corn=0;
      // sugar=0;
      // indigo=0;
      // tabacco=0;
      // coffee=0;
      player.products=[0,0,0,0,0];//corn, sugar, indigo, tabacco,coffee
      player.plantArea=[];
      player.buildingArea= [];
   }
   return;
};

exports.addNewPlayer=function(id, name, socketid){
    if((Players.length > 0) && (findPlayerbyName(name) >= 0)){
        var index = findPlayerbyName(name);
        //var player = Players[index];
        Players[index].socket = socketid;
        Players[index].id = id;
        Players[index].online = 1;

        playerOnlineNum +=1;
        //console.log("Players is replaced.");

    }else{
        var player = {
            id:id,
            name:name,
            socket:socketid,
            online:1,
            points:0,
            totalColonists:0,
            freeColonists:0,
            money:0,
            quarry:0,
            // corn:0,
            // sugar:0,
            // indigo:0,
            // tabacco:0,
            // coffee:0,
            products:[0,0,0,0,0],//corn, sugar, indigo, tabacco,coffee
            plantArea:[],
            buildingArea: []};
        Players.push(player);

        playerNum += 1;
        playerOnlineNum += 1;
        //console.log("Players pushed.");
    }

    //console.log(Players);
    return Players;
};


var findPlayerbyName = function(name){
  var index = -1;
  if(Players == null){
    console.log("Players == null");
    return index;
  }
  for(var i=0; i<Players.length; i++){
      if(Players[i].name == name){
          index = i;
          break;
      }
  }
  console.log("findPlayerbyName index:"+index);
  return index;
};

exports.getPlayerNum = function(){
  return playerNum;
};

exports.getPlayerOnlineNum = function(){
  return playerOnlineNum;
};

exports.getPlayers = function(){
  return Players;
};


exports.updatePlayer=function(name, role, val1){
  var index = findPlayerbyName(name);
  if(index < 0){
    console.log("updatePlayer failed! name is"+name);
    return;
  }
  var player = Players[index];
  //console.log('player:');
  //console.log(player);

  switch(role){
    case 'Settler':
        console.log('Settler plant:');
        console.log(val1);
        player.plantArea.push(val1);
        break;
    case 'Builder':
        player.buildingArea.push(val1);
        break;
    case 'Trader':
        console.log("updatePlayer. val1 is");
        console.log(val1);
        player.money += val1.price;
        if(player.name == rolePlayerName){
          player.money += 1;
          rolePlayerName = "";
        }
        player.products[val1.id-1] -= 1;
        break;
    case 'Mayor':
        player.totalColonists = val1.totalColonists;
        player.freeColonists = val1.freeColonists;
        player.buildingArea = val1.buildingArea;
        player.plantArea = val1.plantArea;
        break;
    case 'Captain':
        player.points += val1;
        break;
    case 'Craftsman':
        player.products = val1.products;
        break;
    case 'Prospector':
        player.money += val1;
        break;
  }
  //console.log(Players);
  return player;
};

// exports.testPlantsNum = function(){
//   return Plants.getPlantsNum();
// };

exports.offlinePlayer = function(socketid){
  var index = findPlayerbySocket(socketid);
  if(index >= 0){
      Players[index].online = 0;
      playerOnlineNum -= 1;
  }
};

var findPlayerbySocket = function(socketid){
  var index = -1;
  if(Players == null){
    return index;
  }
  for(var i=0; i<Players.length; i++){
      if(Players[i].socket == socketid){
          index = i;
      }
  }
  return index;
};

exports.addMoney = function(name, val){
  var index = findPlayerbyName(name);
  Players[index].money +=val;
  return Players[index];
};

exports.addColonits = function(name, val){
   var index = findPlayerbyName(name);
   Players[index].totalColonists += val;
   Players[index].freeColonists += val;
   return Players[index];
};

exports.nextPlayer = function(name){
  console.log('nextPlayer: name='+name);
  var index = findPlayerbyName(name) + 1;
  if(index >= Players.length){
    index = 0;
  }
  return Players[index];
}

exports.setRolePayerName = function(name){
  rolePlayerName = name;
}
