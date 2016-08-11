var Ship1 = {name:null, num:0};
var Ship2 = {name:null, num:0};
var Ship3 = {name:null, num:0};
var Ships = [Ship1, Ship2, Ship3];

var SHIPLENGTH = [5, 6, 7];

exports.loadProduct = function(index, product, number){
  if(checkProduct(index, product)){
      Ships[index].name = product.name;
      Ships[index].num += number;
      if(Ships[index].num > SHIPLENGTH[index]){
          Ships[index].num = SHIPLENGTH[index];
      }
      return true;
  }
  return false;
};

var checkProduct = function(index, obj){
  if((Ships[index].name == null)||(Ships[index].name == obj.name)){
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
