var TradingHouse = [];
var HOUSELENGTH = 4;

exports.inputProduct = function(product){
  if(!isExsit(product)){
      TradingHouse.push(product);
      return true;
  }
  return false;
};

var isExsit = function(obj){
  for(var i=0; i < Trading.length; i++){
      if(Trading[i].id == obj.id){
          return true;
      }
  }
  return false;
};


exports.needtoClearTradingHouse = fucntion(){
  if(TradingHouse.length >= HOUSELENGTH){
    TradingHouse = [];
    return true;
  }else{
      return false;
  }
};
