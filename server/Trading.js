var TradingHouse = [];
var HOUSELENGTH = 4;

exports.init = function(){
    TradingHouse = [];
    HOUSELENGTH = 4;
}

exports.inputProduct = function(product){
  if(!isExsit(product)){
      TradingHouse.push(product);
      return true;
  }
  return false;
};

var isExsit = function(obj){
  for(var i=0; i < TradingHouse.length; i++){
      if(TradingHouse[i].id == obj.id){
          return true;
      }
  }
  return false;
};

exports.getTradingHouse = function(){
  if(TradingHouse.length >= HOUSELENGTH){
    TradingHouse = [];
  }
  return TradingHouse;
};

exports.iniTradingHouse = function(){
  TradingHouse = [];
}
