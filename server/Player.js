//var Plants = require('./Plantation');
//var Buildings = require('./Building');


var Players = [];
var playerNum = 0;
var playerOnlineNum = 0;

exports.initPlayers= function(){
   Players = [];
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
            colonists:0,
            money:0,
            squarry:0,
            corn:0,
            sugar:0,
            indigo:0,
            tabacco:0,
            coffee:0,
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


exports.updatePlayer=function(name, role, val1){
  var index = findPlayerbyName(name);
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
        player.money += val1;
        break;
    case 'Mayor':
        player.buildingArea = val1.buildingArea;
        player.plantArea = val1.plantArea;
        break;
    case 'Captain':
        player.points += val1;
        break;
    case 'Craftsman':
        player.corn = val1.corn;
        player.sugar = val1.sugar;
        player.indigo = val1.indigo;
        player.tabacco = val1.tabacco;
        player.coffee = val1.coffee;
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

exports.nextPlayer = function(name){
  console.log('nextPlayer: name='+name);
  var index = findPlayerbyName(name) + 1;
  if(index >= Players.length){
    index = 0;
  }
  return Players[index];
}
