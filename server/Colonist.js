var colonistsNum = 90;
var Ship = 4; //记录船上奴隶数目

exports.init = function(playerNum){
    initColonistNum(playerNum);
    Ship = playerNum;
}

exports.updateShip = function(players){
    Ship = calculateColonists(players);
    if(colonistsNum > Ship){
        colonistsNum -= Ship;
    }else{
        Ship = colonistsNum;
        colonistsNum = 0;
    }
    return Ship;
};

exports.getColonistsNum = function(){
    return colonistsNum;
}

exports.getRemainder = function(){
    return colonistsNum+Ship;
}

exports.clearShip = function(){
    colonistsNum -= Ship;
    Ship = 0;
    console.log('colonists remainder:'+colonistsNum);
};

function initColonistNum(playerNum){
    switch (playerNum) {
      case 3:
          colonistsNum = 90;
          break;
      case 4:
          colonistsNum = 90;
          break;
      case 5:
          colonistsNum = 90;
          break;
      default: colonistsNum = 90;
    }
};


exports.allotByPlayer = function(index, playerNum, isRolePlayer){
    var number = Math.floor(Ship/playerNum);
    if(Ship-number*playerNum-index > 0){
       number += 1;
    }

    if(isRolePlayer){
      if(colonistsNum > 1){
        colonistsNum -= 1;
        number += 1;
      }
    }
    console.log("colonist::allotByPlayer, "+index+","+playerNum+". number ="+number);
    return number;
}

exports.takeoutColonist = function(){
    if(colonistsNum > 0){
      colonistsNum -= 1;
      return 0;
    }else if(Ship > 0){
      Ship -= 1;
      return 1;
    }else{
      return -1;
    }
}

exports.getShip = function(){
   return Ship;
}

var calculateColonists = function(players){
    var sum =0;
    //根据player的空白奴隶数，计算ship上的奴隶数
    for(var i=0; i<players.length; i++ ){
        var player = players[i];
        ///只根据建筑物的剩余开拓者数量来计算
        for(var j=0; j<player.buildArea.length; j++ ){
            var build = player.buildArea[j];
            sum += build.needColonist - build.actualColonist;
        }
    }
    if(sum > players.length){
      return sum;
    }else{
      return players.length;
    }
};
