var colonistsNum = 90;
var Ship = 4; //记录船上奴隶数目
exports.updateShip = function(){
    Ship = calculateColonists();
    return newShip;
};

exports.updteRemainder = function(){
    colonistsNum -= Ship;
    console.log('colonists remainder:'+colonistsNum);
};

exports.initColonistNum = function(playerNum){
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

var calculateColonists = function(){
    //根据player的空白奴隶数，计算ship上的奴隶数
    return 4;
};
