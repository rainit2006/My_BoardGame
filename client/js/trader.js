//////Trader////
function traderProcess(data){
  var contentString = "";

  if((TRADINGHOUSE != null)&&(TRADINGHOUSE.length >= HOUSELENGTH)){
    contentString = "商会已经满了，不再接受货物贩卖。";
    $('#message').empty().text(contentString);
    $('#SkipBtn').hide();
    return;
  }

  var check = hasProdudct();
  if(!check){
    contentString = "你手里啥货物都没有，啥也做不了！";
    $('#message').empty().text(contentString);
    $('#SkipBtn').hide();
    return;
  }

  options = [];
  ////如果拥有分商会，则可以卖手里的任何货物。
  if( containBuilding('office')){
      contentString = "请选择要贩卖的货物:";
      $('#message').empty().text(contentString);

      for(var i=0; i<myPlayer.products.length; i++){
          if(myPlayer.products[i] != 0){
              options.push(PLANTS[i+1]);
          }
      }

  }else{
      for(var i=0; i<myPlayer.products.length; i++){
          if(myPlayer.products[i] != 0){
              if(!existInTradingHouse(i, TRADINGHOUSE)){
                  options.push(PLANTS[i+1]);
              }
          }
      }
      if(options.length <= 0){
          contentString = "没有可以贩卖的货物。";
          $('#message').empty().text(contentString);
          $('#SkipBtn').hide();
          mySelect.select = null;
          return;
      }else{
          contentString = "请选择要贩卖的货物:";
          $('#message').empty().text(contentString);
      }
  }

  var ulNode= $("<ul>");
  $.each(options, function(index){
      //plantOptions.push(this.name);
      var div = $("<li id='"+options[index].id+"'><img src='../image/"+options[index].name+".png'></li>");
      ulNode.append(div);
  });
  $('#element').empty().append(ulNode);

  $('#element li').on('click', function(){
      ///判断操作的player是不是有效的当前player，如果是则传给服务器data。
      mySelect.select = PLANTS[this.id];

      $('#message').text(contentString).append("<p>你选择的是："+PLANTS[this.id].name+"</p>");
  });
}



function existInTradingHouse(index, house){
    //console.log("trader.js  existInTradingHouse:"+index);
    for(var i=0; i< house.length; i++){
      if(house[i].name == PLANTS[index+1].name)
        return true;
    }
    return false;
}

function hasProdudct(){
    var result = false;
    for(var i=0; i < myPlayer.products.length; i++){
        if(myPlayer.products[i] !=0){
            result = true;
            break;
        }
    }
    return result;
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
