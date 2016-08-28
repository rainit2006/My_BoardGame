 var ulNode1 = null;
 var ulNode2 = null;

function captainProcess(data){
  mySelect = {select:null, extra:null, extra1:null};
  if((data.productClear!=null)&&(data.productClear)){
      shipState.clear = true;
      productClearProcess(data);
  }else{
      productLoadProcess(data);
  }
}

function productLoadProcess(data){
  var contentString = "请选择货物和船只.";
  $('#message').empty().text(contentString);

  var validProduct = [];
  var validShips = [];
  options = [];
  var i = 0;
  ulNode1= $("<ul id='productUL'>");
  $.each(myPlayer.products, function(index){
      //plantOptions.push(this.name);
      if(myPlayer.products[index] > 0){
          var availableShips  = getValidShip(PLANTS[index+1].name, SHIPS);
          if((availableShips != null)&&(availableShips.length > 0)){
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
    $('#ConfirmBtn').prop('disabled', true);
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
  //         mySelect.select = [plantIndex, shipIndex, productNum];
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
        mySelect.select = [plantIndex, shipIndex, productNum];
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


function productClearProcess(data){
  var array = [];

  for(var i=0; i< myPlayer.products.length; i++){
    if(myPlayer.products[i] != 0){
      array.push(i);
    }
  }
  var messageText = "";
  if(array.length == 0){
    messageText = "你手里没有任何货物了。";
  }else if ((array.length == 1)&&(myPlayer.products[array[0]])){
    messageText = "你没有多余的货物需要倒掉。";
  }else{
    var hasSmallWarehouse = containBuilding('small warehouse');
    var hasLargeWarehouse = containBuilding('large warehouse');

    //同时拥有两个仓库
    if(hasSmallWarehouse && hasLargeWarehouse){
      if(array.length <= 3){
          messageText = "你同时拥有【大仓库】和【小仓库】。而且你没有多余的货物需要倒掉。";
      }else{
          messageText = "你同时拥有【大仓库】和【小仓库】。请选择三类要储存的货物和一类只保留1个的货物，其他货物都将被倒掉。";
          var largeWarehouseNode = "<p>【大仓库】：请选择两类要储存的货物（被选择的货物的所有数量都会被保存到下一轮）</p>";
          //largeWarehouseNode +="<div id='largeWarehouse'></div>"
          for(var i=0; i< myPlayer.products.length; i++){
            if(myPlayer.products[i] != 0){
              largeWarehouseNode += "<input type='checkbox' name='largeWarehouse' value='"+i+"' >"+PLANTS[i+1].name+"("+myPlayer.products[i]+"个)</li>";
            }
          }
          var smallWarehouseNode = "<p>【小仓库】：请选择一类要储存的货物（被选择的货物的所有数量都会被保存到下一轮）</p>";
          for(var i=0; i< myPlayer.products.length; i++){
            if(myPlayer.products[i] != 0){
              smallWarehouseNode += "<input type='radio' name='smallWarehouse' value='"+i+"' >"+PLANTS[i+1].name+"("+myPlayer.products[i]+"个)</li>";
            }
          }
          var reserveNode = "<p>请选择一类要保留货物，该类货物只能留1个。剩下的货物将都被倒掉。</p>";
          for(var i=0; i< myPlayer.products.length; i++){
            if(myPlayer.products[i] != 0){
              reserveNode += "<input type='radio' name='reserve' value='"+i+"' >"+PLANTS[i+1].name+"("+myPlayer.products[i]+"个)</li>";
            }
          }

          $('#element').empty().append(largeWarehouseNode+smallWarehouseNode+reserveNode);
      }
    }else if(hasLargeWarehouse){
      if(array.length <= 2){
          messageText = "你拥有【大仓库】，而且你没有多余的货物需要倒掉。";
      }else{
          messageText = "你拥有【大仓库】。请选择两类要储存的货物和一类只保留1个的货物，其他货物都将被倒掉。";
          var largeWarehouseNode = "<p>【大仓库】：请选择两类要储存的货物（被选择的货物的所有数量都会被保存到下一轮）</p>";
          //largeWarehouseNode +="<div id='largeWarehouse'></div>"
          for(var i=0; i< myPlayer.products.length; i++){
            if(myPlayer.products[i] != 0){
              largeWarehouseNode += "<input type='checkbox' name='largeWarehouse' value='"+i+"' >"+PLANTS[i+1].name+"("+myPlayer.products[i]+"个)</li>";
            }
          }
          var reserveNode = "<p>请选择一类要保留货物，该类货物只能留1个。剩下的货物将都被倒掉。</p>";
          for(var i=0; i< myPlayer.products.length; i++){
            if(myPlayer.products[i] != 0){
              reserveNode += "<input type='radio' name='reserve' value='"+i+"' >"+PLANTS[i+1].name+"("+myPlayer.products[i]+"个)</li>";
            }
          }
          $('#element').empty().append(largeWarehouseNode+reserveNode);
      }
    }else if(hasSmallWarehouse){
      if(array.length <= 1){
          messageText = "你拥有【小仓库】。而且你没有多余的货物需要倒掉。";
      }else{
          messageText = "你拥有【小仓库】。请选择一类要储存的货物和一类只保留1个的货物，其他货物都将被倒掉。";
          var smallWarehouseNode = "<p>【小仓库】：请选择一类要储存的货物（被选择的货物的所有数量都会被保存到下一轮）</p>";
          for(var i=0; i< myPlayer.products.length; i++){
            if(myPlayer.products[i] != 0){
              smallWarehouseNode += "<input type='radio' name='smallWarehouse' value='"+i+"' >"+PLANTS[i+1].name+"("+myPlayer.products[i]+"个)</li>";
            }
          }
          var reserveNode = "<p>请选择一类要保留货物，该类货物只能留1个。剩下的货物将都被倒掉。</p>";
          for(var i=0; i< myPlayer.products.length; i++){
            if(myPlayer.products[i] != 0){
              reserveNode += "<input type='radio' name='reserve' value='"+i+"' >"+PLANTS[i+1].name+"("+myPlayer.products[i]+"个)</li>";
            }
          }
          $('#element').empty().append(smallWarehouseNode+reserveNode);
      }
    }else{
      var reserveNode = "<p>请选择一类要保留货物，该类货物只能留1个。剩下的货物将都被倒掉。</p>";
      for(var i=0; i< myPlayer.products.length; i++){
        if(myPlayer.products[i] != 0){
          reserveNode += "<input type='radio' name='reserve' value='"+i+"' >"+PLANTS[i+1].name+"("+myPlayer.products[i]+"个)</li>";
        }
        $('#element').empty().append(reserveNode);
      }
    }
  }
  $('#message').empty().text(messageText);
}


$(document).on('change', '[type=checkbox]', function(){
    console.log(this.value+";"+this.name+";"+this.checked);

    ///将该类货物的radio控件dsiable
    if($("input[name = 'smallWarehouse']")[0]){
      $("input[name = 'smallWarehouse'][value='"+this.value+"']").prop("disabled", this.checked);
    }
    $("input[name = 'reserve'][value='"+this.value+"']").prop("disabled", this.checked);

    ///如果checked货物等于两类，则disable其他的货物
    var $count = $("input[type=checkbox]:checked").length;
    var $not = $("input[type=checkbox]").not(":checked");
    console.log($count)
    if($count >= 2){
      $not.prop("disabled", true);
    }else{
      $not.prop("disabled", false);
    }
    mySelect.extra1 = [];
    $.each($("input[type=checkbox]:checked"), function(){
      mySelect.extra1.push($(this).val());
      console.log("largeWarehouse"+$(this).val());
    });
});

$(document).on('change', '[type=radio]', function(){
    console.log(this.value+";"+this.name);

    if(this.name == "smallWarehouse"){
      ////
      if($("input[name = 'largeWarehouse']")[0]){
        $("input[name = 'largeWarehouse'][value='"+this.value+"']").prop("disabled", this.checked);
      }
      $("input[name = 'reserve'][value='"+this.value+"']").prop("disabled", this.checked);
      ////
      if(this.checked){
        mySelect.extra = this.value;
      }
    }else if(this.name == "reserve"){
      ////
      if($("input[name = 'largeWarehouse']")[0]){
        $("input[name = 'largeWarehouse'][value='"+this.value+"']").prop("disabled", this.checked);
      }
      if($("input[name = 'smallWarehouse']")[0]){
        $("input[name = 'smallWarehouse'][value='"+this.value+"']").prop("disabled", this.checked);
      }
      /////
      if(this.checked){
        mySelect.select = this.value;
      }
    }
});
