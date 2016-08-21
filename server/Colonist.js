var colonistsNum = 90;
var Ship = 4; //记录船上奴隶数目

exports.init = function(playerNum){
    initColonistNum(playerNum);
    Ship = 4;
}

exports.updateShip = function(){
    Ship = calculateColonists();
    return Ship;
};


exports.updateRemainder = function(){
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

exports.allotByPlayer = function(num, playerNum){
    var number = Math.floor(Ship/playerNum);
    if(Ship%playerNum-num > 0){
       number += 1;
    }
    return number;
}

var calculateColonists = function(){
    var num = 4;
    //根据player的空白奴隶数，计算ship上的奴隶数
    return num;
};
