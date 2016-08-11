var ulNode1 = null;
var ulNode2 = null;

function captainProcess(data){
  var contentString = "请选择货物和船只.";
  $('#message').empty().text(contentString);

  SHIPS = data.ships;
  var validProduct = [];
  var validShips = [];
  options = [];
  var i = 0;
  ulNode1= $("<ul id='productUL'>");
  $.each(myPlayer.products, function(index){
      //plantOptions.push(this.name);
      if(myPlayer.products[index] > 0){
          var availableShips  = getValidShip(PLANTS[index+1].name, SHIPS);
          if(availableShips != null){
              options.push({plantID:index+1, ship:availableShips});
              var div = $("<li id='"+i+"'>"+PLANTS[index+1].name+"</li>");
              i += 1;
              ulNode1.append(div);
          }
      }
  });
  if(options.length == 0){
    var contentString = "你没有能交易的货物.";
    $('#message').empty().text(contentString);
    $('#element').empty();
    return;
  }
  $('#element').empty().append("<p>Product:</p>").append(ulNode1);

  // $('#productUL li').on('click', function(){
  //     ///判断操作的player是不是有效的当前player，如果是则传给服务器data。
  //
  //     var plantIndex = options[this.id].plantID;
  //     var string1 = "你选择的货物是："+PLANTS[plantIndex].name;
  //     $('#message').empty().text(contentString).append(string1);
  //     var ulNode2= $("<ul id='shipUL'>");
  //     var ships = options[this.id].ship;
  //     $.each(ships, function(index){
  //         //plantOptions.push(this.name);
  //         var div = $("<li id='"+ships[index]+"'> #"+ships[index]+"</li>");
  //         ulNode2.append(div);
  //     });
  //     $('#element').empty().append("<p>Product:</p>").append(ulNode1).append("<p>可选择的货船:</p>").append(ulNode2);
  //
  //     $('#shipUL li').on('click', function(){
  //         var shipIndex = this.id;
  //         var string2 = string1 + "; 货船是： #"+shipIndex;
  //
  //         var productNum = 0;
  //         if(myPlayer.products[plantIndex-1] < (SHIPLENGTH[shipIndex]-SHIPS[shipIndex].num)){
  //             productNum = myPlayer.products[plantIndex-1];
  //         }else{
  //             productNum = SHIPLENGTH[shipIndex]-SHIPS[shipIndex].num;
  //         }
  //         myPlayer.select = [plantIndex, shipIndex, productNum];
  //         string2 += ". 可装载的货物数量是:"+productNum;
  //         $('#message').empty().text(contentString).append(string2);
  //     });
  // });
}


$(document).on('click', '#productUL li',function(){
    var plantIndex = options[this.id].plantID;
    var string1 = "你选择的货物是："+PLANTS[plantIndex].name;
    $('#message').empty().text("请选择货物和船只.").append(string1);
    ulNode2= $("<ul id='shipUL'>");
    var ships = options[this.id].ship;
    $.each(ships, function(index){
        //plantOptions.push(this.name);
        var div = $("<li id='"+ships[index]+"'> #"+ships[index]+"</li>");
        ulNode2.append(div);
    });
    $('#element').empty().append("<p>Product:</p>").append(ulNode1).append("<p>可选择的货船:</p>").append(ulNode2);

    $('#shipUL li').on('click', function(){
        var shipIndex = this.id;
        var string2 = string1 + "; 货船是： #"+shipIndex;

        var productNum = 0;
        if(myPlayer.products[plantIndex-1] < (SHIPLENGTH[shipIndex]-SHIPS[shipIndex].num)){
            productNum = myPlayer.products[plantIndex-1];
        }else{
            productNum = SHIPLENGTH[shipIndex]-SHIPS[shipIndex].num;
        }
        myPlayer.select = [plantIndex, shipIndex, productNum];
        string2 += ". 可装载的货物数量是:"+productNum;
        $('#message').empty().text("请选择货物和船只.").append(string2);
    });
});


function getValidShip(productName, Ships){
  var validShips = [];
  if(Ships == null){
    console.log("err in getValidShip: Ships is null.");
    return null;
  }
  $.each(Ships, function(index){
    if(Ships[index].name == productName){
        if(Ships[index].num < SHIPLENGTH[index]){
            return index;
        }else{
            return null;
        }
    }else{
        if(Ships[index].name == null){
            validShips.push(index);
        }
    }
  });
  return validShips;
}
