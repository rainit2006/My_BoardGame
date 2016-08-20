//////Trader////
function traderProcess(data){
  TRADINGHOUSE = data.tradingHouse;
  drawTradeArea();

  options = [];
  for(var i=0; i<myPlayer.products.length; i++){
      if(myPlayer.products[i] != 0){
          if(!existInTradingHouse(i, TRADINGHOUSE)){
              options.push(PLANTS[i+1]);
          }
      }
  }

  var contentString = "";
  if(options.length <= 0){
      contentString = "没有可以贩卖的货物。";
  }else{
      contentString = "请选择要贩卖的货物:";
  }
  $('#message').empty().text(contentString);

  var ulNode= $("<ul>");
  $.each(options, function(index){
      //plantOptions.push(this.name);
      var div = $("<li id='"+options[index].id+"'>"+options[index].name+"</li>");
      ulNode.append(div);
  });
  $('#element').empty().append(ulNode);

  $('#element li').on('click', function(){
      ///判断操作的player是不是有效的当前player，如果是则传给服务器data。
      mySelect.select = PLANTS[this.id];
      $('#message').text(contentString).append("<p>你选择的是："+$(this).text()+"</p>");
  });
}



function existInTradingHouse(index, house){
  console.log("trader.js  existInTradingHouse:"+index);
  for(var i=0; i< house.length; i++){
    if(house[i].name == PLANTS[index+1].name)
      return true;
  }
  return false;
}

// function drawTradingHouse(house){
//     if(house == null){
//       $('#TradingHouse').empty();
//       return;
//     }
//     var string="";
//     for(var i=0; i<house.length; i++){
//       var string = string + "<li>"+house[i].name+"</li>";
//     }
//     $('#TradingHouse').empty().append("<ul>"+string+"</ul>");
// }
