var Ship1 = {id:null, num:0};
var Ship2 = {id:null, num:0};
var Ship3 = {id:null, num:0};
var Ships = [Ship1, Ship2, Ship3];

var SHIPLENGTH = [5, 6, 7];

exports.inputProduct = function(index, product){
  if(checkProduct(index, product)){
      Ships[index].id = product.id;
      Ships[index].num += 1;
      return true;
  }
  return false;
};

var checkProduct = function(index, obj){
  if(Ships[index].id == null) ||(Ships[index].id == obj.id)){
      return true;
  }
  return false;
};


exports.needtoClearShip = fucntion(index){
  if(Ships[index].num >= SHIPLENGTH[index]){
    Ships[index].id = null;
    Ships[index].num = 0;
    return true;
  }else{
      return false;
  }
};
