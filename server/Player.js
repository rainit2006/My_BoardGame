var Plants = require('./Plantation');

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
        console.log("Players is replaced.");

    }else{
        var player = {
            id:id,
            name:name,
            socket:socketid,
            online:1,
            points:0,
            colonists:0,
            money:0,
            corn:0,
            sugar:0,
            indigo:0,
            tabacco:0,
            coffee:0,
            PlantArea:[],
            BuildingArea: []};
        Players.push(player);

        playerNum += 1;
        playerOnlineNum += 1;
        console.log("Players pushed.");
    }

    console.log(Players);
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
  console.log("index:"+index);
  return index;
};

exports.getPlayerNum = function(){
  return playerNum;
};

exports.getPlayerOnlineNum = function(){
  return playerOnlineNum;
};


exports.updatePlayer=function(id, role, val1){
  var player = Players[id];

  switch(role){
    case 'Settler':
        var plant = Plants.getPlant(val1);
        player.PlantArea.push(plant);
        break;
    case '':
        break;
    case '':
        break;
    case '':
        break;
    case '':
        break;
    case '':
        break;
    case '':
        break;
    case '':
        break;
  }

  return Players;
};

exports.testPlantsNum = function(){
  return Plants.getPlantsNum();
};

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
