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

  var wharfNode= $("<div id='wharf'></div>");
  var node = $("<ul id='wharfUL'></ul>");
  var flag = false;
  if(containBuilding('wharf')&&(!shipState.wharf)){
      $.each(myPlayer.products, function(index){
          if(myPlayer.products[index] > 0){
              node.append("<span><input type='radio' name='wharf' value='"+index+"' ><img src='../image/"+PLANTS[index+1].name+".png'>"+myPlayer.products[index]+"个</span>");
              flag = true;
          }
      });
  }
  if(flag){
    wharfNode.append("你拥有【船坞】，可以使用自己的【船坞船】来装载任何一类货物。请选择要装载到【船坞船】的货物（每轮船长阶段最多只能使用一次）。").append(node);
  }

  var hasProduct = false;
  ulNode1=$("<div></div>");
  var nodeDiv=$("<div id='products' class='flexBox-row'></div>");
  $.each(myPlayer.products, function(index){
      //plantOptions.push(this.name);
      if(myPlayer.products[index] > 0){
          var availableShips  = getValidShip(PLANTS[index+1].name, SHIPS);
          if((availableShips != null)&&(availableShips.length > 0)){
              //options.push({plantID:index+1, ship:availableShips});
              var div = "<span><input type='radio' name='product' value='"+index+"' ><img src='../image/"+PLANTS[index+1].name+".png'>"+myPlayer.products[index]+"个</span>";
              nodeDiv.append(div);
              hasProduct = true;
          }else{
              var div = "<span><input type='radio' name='product' disabled='true'><img class='disabled' src='../image/"+PLANTS[index+1].name+".png'>"+myPlayer.products[index]+"个</span>";
              nodeDiv.append(div);
          }
      }
  });
  ulNode1.append(nodeDiv);
  if(hasProduct){
    ulNode1.prepend("<p>请选择要装载到运输船上的货物:</p>");
  }else{
    ulNode1.prepend("<p>你没有可以装载到运输船上的货物。</p>");
  }

  if((!hasProduct)&&(!flag)){
    var contentString = "你没有能交易的货物.";
    $('#message').empty().text(contentString);
    $('#element').empty();
    $('#ConfirmBtn').prop('disabled', false);
    $('#SkipBtn').hide();
    return;
  }

  ////描绘运输船
  var shipsNode = $("<div id='ships'></div>");
  $.each(SHIPS, function(index){
      var shipNode = "<span class='flexBox-row'><input type='radio' name='ship' value='"+index+"'><img src='../image/ship"+index+".png'><ul>";
      for(var j=0; j<SHIPS[index].num; j++){
          var plant = getPlantByName(SHIPS[index].name);
          shipNode +="<li><img src='../image/"+plant.name+".png'></li>";
      }
      for(var j=0; j<(SHIPLENGTH[index]-SHIPS[index].num); j++){
          shipNode += "<li class='white'></li>";
      }
      shipNode += "</ul><span>";
      shipsNode.append(shipNode);
  });
  shipsNode.prepend("<p>运输船：</p>");

  $('#element').empty().append(ulNode1).append(shipsNode).append("<hr>").append(wharfNode).append("<hr>").append("<p id='selection'></p>");
  $("#ships :radio[name='ship']").prop("checked", false);
  $("#ships :radio[name='ship']").prop("disabled", true);
}


// $(document).on('click', '#productUL li',function(){
//     var plantIndex = options[this.id].plantID;
//     var string1 = "你选择的货物是："+PLANTS[plantIndex].name;
//     $('#message').empty().text("请选择货物和船只.").append(string1);
//     ulNode2= $("<ul id='shipUL'>");
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
//         $('#message').empty().text("请选择货物和船只.").append(string2);
//     });
// });


function getValidShip(productName, Ships){
  var validShips = [];
  if(Ships == null){
    console.log("err in getValidShip: Ships is null.");
    return null;
  }
  $.each(Ships, function(index){
    if(Ships[index].name == productName){
        if(Ships[index].num < SHIPLENGTH[index]){
            validShips = [];
            validShips.push(index);
            return;
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
    $('#SkipBtn').hide();
  }else if ((array.length == 1)&&(myPlayer.products[array[0]])){
    messageText = "你没有多余的货物需要倒掉。";
    mySelect.select = "all";
    $('#SkipBtn').hide();
  }else{
    var hasSmallWarehouse = containBuilding('small warehouse');
    var hasLargeWarehouse = containBuilding('large warehouse');

    //同时拥有两个仓库
    if(hasSmallWarehouse && hasLargeWarehouse){
      if(array.length <= 3){
          messageText = "你同时拥有【大仓库】和【小仓库】。而且你没有多余的货物需要倒掉。";
          mySelect.select = "all";
      }else{
          messageText = "你同时拥有【大仓库】和【小仓库】。请选择三类要储存的货物和一类只保留1个的货物，其他货物都将被倒掉。";
          var largeWarehouseNode = "<div>【大仓库】：请选择两类要储存的货物（被选择的货物的所有数量都会被保存到下一轮）</div>";
          //largeWarehouseNode +="<div id='largeWarehouse'></div>"
          for(var i=0; i< myPlayer.products.length; i++){
            if(myPlayer.products[i] != 0){
              largeWarehouseNode += "<span><input type='checkbox' name='largeWarehouse' value='"+i+"' ><img src='../image/"+PLANTS[i+1].name+".png'>("+myPlayer.products[i]+"个)</span>";
            }
          }
          var smallWarehouseNode = "<div>【小仓库】：请选择一类要储存的货物（被选择的货物的所有数量都会被保存到下一轮）</div>";
          for(var i=0; i< myPlayer.products.length; i++){
            if(myPlayer.products[i] != 0){
              smallWarehouseNode += "<span><input type='radio' name='smallWarehouse' value='"+i+"' ><img src='../image/"+PLANTS[i+1].name+".png'>("+myPlayer.products[i]+"个)</span>";
            }
          }
          var reserveNode = "<div>请选择一类要保留货物，该类货物只能留1个。剩下的货物将都被倒掉。</div>";
          for(var i=0; i< myPlayer.products.length; i++){
            if(myPlayer.products[i] != 0){
              reserveNode += "<span><input type='radio' name='reserve' value='"+i+"' ><img src='../image/"+PLANTS[i+1].name+".png'>("+myPlayer.products[i]+"个)</span>";
            }
          }

          $('#element').empty().append(largeWarehouseNode+smallWarehouseNode+reserveNode);
      }
    }else if(hasLargeWarehouse){
      if(array.length <= 2){
          messageText = "你拥有【大仓库】，而且你没有多余的货物需要倒掉。";
          mySelect.select = "all";
      }else{
          messageText = "你拥有【大仓库】。请选择两类要储存的货物和一类只保留1个的货物，其他货物都将被倒掉。";
          var largeWarehouseNode = "<div>【大仓库】：请选择两类要储存的货物（被选择的货物的所有数量都会被保存到下一轮）</div>";
          //largeWarehouseNode +="<div id='largeWarehouse'></div>"
          for(var i=0; i< myPlayer.products.length; i++){
            if(myPlayer.products[i] != 0){
              largeWarehouseNode += "<input type='checkbox' name='largeWarehouse' value='"+i+"' ><img src='../image/"+PLANTS[i+1].name+".png'>("+myPlayer.products[i]+"个)</li>";
            }
          }
          var reserveNode = "<div>请选择一类要保留货物，该类货物只能留1个。剩下的货物将都被倒掉。</div>";
          for(var i=0; i< myPlayer.products.length; i++){
            if(myPlayer.products[i] != 0){
              reserveNode += "<input type='radio' name='reserve' value='"+i+"' ><img src='../image/"+PLANTS[i+1].name+".png'>("+myPlayer.products[i]+"个)</li>";
            }
          }
          $('#element').empty().append(largeWarehouseNode+reserveNode);
      }
    }else if(hasSmallWarehouse){
      if(array.length <= 1){
          messageText = "你拥有【小仓库】。而且你没有多余的货物需要倒掉。";
          mySelect.select = "all";
      }else{
          messageText = "你拥有【小仓库】。请选择一类要储存的货物和一类只保留1个的货物，其他货物都将被倒掉。";
          var smallWarehouseNode = "<div>【小仓库】：请选择一类要储存的货物（被选择的货物的所有数量都会被保存到下一轮）</div>";
          for(var i=0; i< myPlayer.products.length; i++){
            if(myPlayer.products[i] != 0){
              smallWarehouseNode += "<input type='radio' name='smallWarehouse' value='"+i+"' ><img src='../image/"+PLANTS[i+1].name+".png'>("+myPlayer.products[i]+"个)</li>";
            }
          }
          var reserveNode = "<div>请选择一类要保留货物，该类货物只能留1个。剩下的货物将都被倒掉。</div>";
          for(var i=0; i< myPlayer.products.length; i++){
            if(myPlayer.products[i] != 0){
              reserveNode += "<input type='radio' name='reserve' value='"+i+"' ><img src='../image/"+PLANTS[i+1].name+".png'>("+myPlayer.products[i]+"个)</li>";
            }
          }
          $('#element').empty().append(smallWarehouseNode+reserveNode);
      }
    }else{
      var reserveNode = "<div>请选择一类要保留货物，该类货物只能留1个。剩下的货物将都被倒掉。</div>";
      for(var i=0; i< myPlayer.products.length; i++){
        if(myPlayer.products[i] != 0){
          reserveNode += "<input type='radio' name='reserve' value='"+i+"' ><img src='../image/"+PLANTS[i+1].name+".png'>("+myPlayer.products[i]+"个)</li>";
        }
        $('#element').empty().append(reserveNode);
      }
    }
  }
  $('#message').empty().append(messageText);
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
    if(currentRole != 'Captain'){
      return;
    }
    if(!shipState.clear){
        if(this.name == "product"){
            $("#ships :radio[name='ship']").prop("checked", false);
            $("#ships :radio[name='ship']").prop("disabled", true);
            var validShips = getValidShip(PLANTS[parseInt(this.value, 10)+1].name, SHIPS);
            for(var i=0; i<validShips.length; i++){
                $("#ships :radio[name='ship'][value='"+validShips[i]+"']").prop("disabled", false);
            }
            if($("input[name = 'wharf']")[0]){
                $("#wharf :radio[name='wharf']").prop("checked", false);
            }
            mySelect.select=[null, null];
            mySelect.select[0] = parseInt(this.value,10)+1;
            mySelect.extra = null;
            mySelect.extra1 = null;
            $('#selection').html("...");
        }else if(this.name=="ship"){
            var index = mySelect.select[0]-1;
            var productNum = myPlayer.products[index];
            //var index_ship = parseInt(this.value, 10);
            if(productNum < (SHIPLENGTH[this.value] - SHIPS[this.value].num)){
                mySelect.select[1] = productNum;
            }else{
                mySelect.select[1] = SHIPLENGTH[this.value] - SHIPS[this.value].num;
            }

            mySelect.extra = parseInt(this.value, 10);
            mySelect.extra1 = null;
            $('#selection').html("你选择了"+PLANTS[mySelect.select[0]].name+"和 运输船#"+(mySelect.extra+1)+"。你可以装载"+mySelect.select[1]+"个该货物到运输船。");
        }else if(this.name == "wharf"){
            $("#products :radio[name='product']").prop("checked", false);
            $("#ships :radio[name='ship']").prop("checked", false);
            $("#ships :radio[name='ship']").prop("disabled", true);
            mySelect.select = null;
            mySelect.extra = null;
            var index = parseInt(this.value, 10);
            mySelect.extra1 = [null, null];
            mySelect.extra1[0] = index+1;
            mySelect.extra1[1] = myPlayer.products[index];
            $('#selection').html("你选择了"+PLANTS[index+1].name+"。你可以装载"+mySelect.extra1[1]+"个该货物到【船坞船】。");
        }


    }else{
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
    }


});
