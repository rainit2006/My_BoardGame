var Ship0 = {name:null, num:0};
var Ship1 = {name:null, num:0};
var Ship2 = {name:null, num:0};
var Ships = [Ship0, Ship1, Ship2];

var SHIPLENGTH = [5, 6, 7];

exports.loadProduct = function(index, name, number){
  console.log('Ship loadproduct:'+index+";"+name+";"+number);
  if(checkProduct(index, name)){
      Ships[index].name = name;
      Ships[index].num += number;
      if(Ships[index].num > SHIPLENGTH[index]){
          Ships[index].num = SHIPLENGTH[index];
      }
      return true;
  }
  return false;
};

var checkProduct = function(index, name){
  if((Ships[index].name == null)||(Ships[index].name == name)){
      return true;
  }
  return false;
};


exports.getShip = function(index){
  return Ships[index];
};

exports.getShips = function(){
  return Ships;
}

exports.updateShips = function(){
  for(var i=0; i < 3; i++){
      if(Ships[i].num == SHIPLENGTH[i]){
          Ships[i].name = null;
          Ships[i].num = 0;
      }
  }
  return Ships;
}

exports.initShips = function(){
  // Ship0 = {name:null, num:0};
  // Ship1 = {name:null, num:0};
  // Ship2 = {name:null, num:0};
  Ship0 = {name:'corn', num:5};
  Ship1 = {name:'coffee', num:6};
  Ship2 = {name:'tobacco', num:7};
  Ships = [Ship0, Ship1, Ship2];
}
