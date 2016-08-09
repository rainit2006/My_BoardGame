//////Trader////
function existInTradingHouse(index, house){
  console.log("trader.js  existInTradingHouse:"+index);
  for(var i=0; i< house.length; i++){
    if(house[i].name == PLANTATION[index])
      return true;
  }
  return false;
}


function drawTradingHouse(house){
    if(house == null){
      return;
    }
    var string="";
    for(var i=0; i<house.length; i++){
      var string = string + "<li>"+house[i].name+"</li>";
    }
    $('#TradingHouse').empty().append("<ul>"+string+"</ul>");
}
