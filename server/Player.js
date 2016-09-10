//var Plants = require('./Plantation');
//var Buildings = require('./Building');

var MAX_PLAYER = 5;
var Players = [];
var playerNum = 1;
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
      if(player.online == 0){
        Players.splice(i, 1);
      }
      player.points=0;
      player.totalColonists=0;
      player.freeColonists=0;
      player.money=0;
      player.quarry=0;
      player.products=[0,0,0,0,0];//corn, sugar, indigo, tabacco,coffee
      player.plantArea=[];
      player.buildArea=[];
   }
   return;
};

exports.addNewPlayer=function(name, socketid){
    if((Players.length > 0) && (findPlayerbyName(name) >= 0)){
        var index = findPlayerbyName(name);
        //var player = Players[index];
        Players[index].socket = socketid;
        Players[index].id = createPlayerID();
        Players[index].online = 1;

        playerOnlineNum +=1;
        //console.log("Players is replaced.");

    }else{
        var player = {
            id:createPlayerID(),
            name:name,
            socket:socketid,
            online:1,
            points:0,
            totalColonists:0,
            freeColonists:0,
            money:0,
            quarry:0,
            products:[0,0,0,0,0],//corn, sugar, indigo, tabacco,coffee
            plantArea:[],
            buildArea: []
        };
        Players.push(player);
        playerOnlineNum += 1;
        //console.log("Players pushed.");
    }

    playerNum = Players.length;
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
  //console.log("findPlayerbyName index:"+index);
  return index;
};

exports.getPlayerNum = function(){
  playerNum = Players.length;
  return playerNum;
};

exports.getPlayerOnlineNum = function(){
  return playerOnlineNum;
};

exports.getPlayers = function(){
  return Players;
};

exports.overwritePlayer = function(player){
  var index = findPlayerbyName(player.name);
  Players[index] = player;
  //console.log(Players);
}

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
        //console.log('Settler plant:');
        //console.log(val1);
        player.plantArea.push(val1);
        // if(val1.name =="quarry" ){
        //   player.quarry += 1;
        // }
        break;
    case 'Builder':
        player.buildArea.push(val1[0]);
        player.money -= val1[1];
        break;
    case 'Trader':
        //console.log("updatePlayer. val1 is");
        //console.log(val1);
        player.money += val1[0];
        player.products[val1[1]-1] -= 1;

        break;
    case 'Mayor':
        player.actualColonists = val1.actualColonists;
        player.freeColonists = val1.freeColonists;
        player.buildArea = val1.buildArea;
        player.plantArea = val1.plantArea;
        break;
    case 'Captain':
        player.points += val1[2];
        var index = val1[0]-1;
        player.products[index] -= val1[1];
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
  return Players;
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

exports.addColonits = function(name, val1,  val2){
   var index = findPlayerbyName(name);
   Players[index].totalColonists += val1;
   Players[index].freeColonists += val2;
   return Players[index];
};

exports.nextPlayer = function(name){
  //console.log('nextPlayer: name='+name);
  var index = findPlayerbyName(name) + 1;
  if(index >= Players.length){
    index = 0;
  }
  return Players[index];
}

exports.getPlayerByName = function(name){
  var index = findPlayerbyName(name);
  return Players[index];
};

exports.initGovenor = function(){
  playerNum = Players.length;
  var index= Math.floor(Math.random()*playerNum);

  switch(playerNum){
    case 3:
        for(var i = 0; i<Players.length; i++){
            Players[i].money=2;
        }
        var secondPlayer = Players[(index+1)%playerNum];
        secondPlayer.plantArea.push({id:3, name:'indigo', price:2, color:'blue', needColonist:1, actualColonist:0});
        var thirdPlayer = Players[(index+2)%playerNum];
        thirdPlayer.plantArea.push({id:1, name:'corn', price:0, color:'yellow', needColonist:1, actualColonist:0});
        break;
    case 4:
        for(var i = 0; i<Players.length; i++){
            Players[i].money = 3;
        }
        var secondPlayer = Players[(index+1)%playerNum];
        secondPlayer.plantArea.push({id:3, name:'indigo', price:2, color:'blue', needColonist:1, actualColonist:0});
        var thirdPlayer = Players[(index+2)%playerNum];
        thirdPlayer.plantArea.push({id:1, name:'corn', price:0, color:'yellow', needColonist:1, actualColonist:0});
        var forthPlayer = Players[(index+3)%playerNum];
        forthPlayer.plantArea.push({id:1, name:'corn', price:0, color:'yellow', needColonist:1, actualColonist:0});
        break;
    case 5:
        for(var i = 0; i<Players.length; i++){
            Players[i].money = 4;
        }
        var secondPlayer = Players[(index+1)%playerNum];
        secondPlayer.plantArea.push({id:3, name:'indigo', price:2, color:'blue', needColonist:1, actualColonist:0});
        var thirdPlayer = Players[(index+2)%playerNum];
        thirdPlayer.plantArea.push({id:3, name:'indigo', price:2, color:'blue', needColonist:1, actualColonist:0});
        var forthPlayer = Players[(index+3)%playerNum];
        forthPlayer.plantArea.push({id:1, name:'corn', price:0, color:'yellow', needColonist:1, actualColonist:0});
        var fifthPlayer = Players[(index+4)%playerNum];
        fifthPlayer.plantArea.push({id:1, name:'corn', price:0, color:'yellow', needColonist:1, actualColonist:0});
        break;
    default:
        for(var i = 0; i<Players.length; i++){
            Players[i].money = 1;
        }
        var secondPlayer = Players[(index+1)%playerNum];
        secondPlayer.plantArea.push({id:3, name:'indigo', price:2, color:'blue', needColonist:1, actualColonist:0});
        break;
  }

  //console.log(index);
  return Players[index].name;
}

exports.setRolePayerName = function(name){
  rolePlayerName = name;
}

exports.getRolePayerName = function(){
  return rolePlayerName;
}

exports.clearRolePayerName = function(name){
  rolePlayerName = "";
}

exports.getBuildingSpaces = function(playerName){
  var index = findPlayerbyName(playerName);
  var buildings = Players[index].buildArea;
  var spaces = 0;
  for(var i=0; i< buildings.length; i++){
      spaces += buildings[i].space;
  }
  return spaces;
}

exports.getPoints = function(playerName){
  var index = findPlayerbyName(playerName);
  var player = Players[index];
  var points = player.points;
  var buildingPoints = 0;
  var extraPoints = 0;

  for(var i=0; i<player.buildArea.length; i++){
      var building = player.buildArea[i];
      buildingPoints += building.points;
  }

  ///公会大厅
  if(containBuilding(player, 'guild hall')){
      for(var i=0; i<player.buildArea.length; i++){
          var id = player.buildArea[i].id;
          if((id == 1)||(id==3)){
            extraPoints += 1;
          }else if((id == 2)||(id==4)||(id == 5)||(id==6)){
            extraPoints += 2;
          }
      }
  }
  ///公馆
  if(containBuilding(player, 'residence')){
      var length = player.plantArea.length;
      if(length <= 9){
        extraPoints += 4;
      }else if(length == 10){
        extraPoints += 5;
      }else if(length == 11){
        extraPoints += 6;
      }else if(length == 12){
        extraPoints += 7;
      }
  }
  ///堡垒
  if(containBuilding(player, 'fortress')){
      extraPoints += Math.floor(player.totalColonists / 3);
  }
  ///海关
  if(containBuilding(player, 'customs house')){
      extraPoints += Math.floor(player.points / 4);
  }
  ///市政厅
  if(containBuilding(player, 'city hall')){
      for(var i=0; i<player.buildArea.length; i++){
          var color = player.buildArea[i].color;
          if(color=='purple'){
            extraPoints += 1;
          }
      }
  }

  var sumPoints = points + buildingPoints + extraPoints;
  return [sumPoints, points, buildingPoints, extraPoints];
}


function containBuilding(player, buildingName){
  var result = false;
  for(var i =0; i<player.buildArea.length; i++){
    if(player.buildArea[i].name == buildingName){
        if(player.buildArea[i].actualColonist == 1){
            result = true;
            return result;
        }
    }
  }
  return result;
}

function createPlayerID(){
  var id = 0;
  if(Players == null){
    return id;
  }
  for(var i=0; i < MAX_PLAYER; i++){
      var found = false;
      for(var j=0; j < Players.length; j++){
          if(Players[j].id == i){
              found = true;
              break;
          }
      }
      if(!found){
        id=i;
        break;
      }
  }
  return id;
}
