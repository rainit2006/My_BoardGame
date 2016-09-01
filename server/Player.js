//var Plants = require('./Plantation');
//var Buildings = require('./Building');

var MAX_PLAYER = 5;
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
      player.money=20;
      player.quarry=0;
      // corn=0;
      // sugar=0;
      // indigo=0;
      // tabacco=0;
      // coffee=0;
      player.products=[1,1,4,1,1];//corn, sugar, indigo, tabacco,coffee
      //player.plantArea=[];
      player.plantArea=[{id:4, name:'tobacco', price:3, color:'lt-brown', needColonist:1, actualColonist:1}];
      //player.buildArea=[];
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
            money:20,
            quarry:0,
            // corn:0,
            // sugar:0,
            // indigo:0,
            // tabacco:0,
            // coffee:0,
            products:[1,1,4,1,1],//corn, sugar, indigo, tabacco,coffee
            //plantArea:[],
            plantArea:[{id:4, name:'tobacco', price:3, color:'lt-brown', needColonist:1, actualColonist:1}],
            //buildArea:[]
            buildArea: [
              {id:7,name:'small market', points:1, quarry:1, price:1, needColonist:1, actualColonist:1, space:1, color:'purple' },
              {id:8,name:'hacienda', points:1, quarry:1, price:2, needColonist:1, actualColonist:1, space:1, color:'purple' }, //农庄
              {id:9,name:'construction hut', points:1, quarry:1, price:2, needColonist:1, actualColonist:1, space:1, color:'purple' },
              {id:10,name:'small warehouse', points:1, quarry:1, price:3, needColonist:1, actualColonist:1, space:1, color:'purple' },
              {id:12,name:'office', points:2, quarry:2, price:5, needColonist:1, actualColonist:1, space:1, color:'purple' }, //分商会
              {id:13,name:'large market', points:2, quarry:2, price:5, needColonist:1, actualColonist:1, space:1, color:'purple' },
              {id:14,name:'large warehouse', points:2, quarry:2, price:6, needColonist:1, actualColonist:1, space:1, color:'purple' },
              {id:15,name:'factory', points:3, quarry:3, price:7, needColonist:1, actualColonist:1, space:1, color:'purple' },
              {id:16,name:'university', points:3, quarry:3, price:8, needColonist:1, actualColonist:1, space:1, color:'purple' },
              {id:17,name:'harbor', points:3, quarry:3, price:8, needColonist:1, actualColonist:1, space:1, color:'purple' },
              {id:18,name:'wharf', points:3, quarry:3, price:9, needColonist:1, actualColonist:1, space:1, color:'purple' }
                ]
        };
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
  //console.log("findPlayerbyName index:"+index);
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
        console.log('Settler plant:');
        console.log(val1);
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
        player.totalColonists = val1.totalColonists;
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

exports.addColonits = function(name, val){
   var index = findPlayerbyName(name);
   Players[index].totalColonists += val;
   Players[index].freeColonists += val;
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

exports.setRolePayerName = function(name){
  rolePlayerName = name;
}

exports.getRolePayerName = function(){
  return rolePlayerName;
}

exports.clearRolePayerName = function(name){
  rolePlayerName = "";
}


exports.containBuilding = function(player, name){
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
