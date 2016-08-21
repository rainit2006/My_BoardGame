//////Mayor//////
function mayorProcess(data){
    myPlayer.freeColonists += data.colonist;
    myPlayer.totalColonists += data.colonist;
    drawColonistList();
}

function drawColonistList(){
    var contentString = "请分配你的奴隶. 空闲奴隶："+myPlayer.freeColonists+"人";
    $('#message').empty().text(contentString);

    var selectItem="";
    $.each(myPlayer.plantArea, function(index){
      var plant = myPlayer.plantArea[index];
      var ItemNode = plant.name+".已拥有:"+plant.actualColonist+"人; 残缺:"+(plant.needColonist - plant.actualColonist)+"人.";
      var addBtn ="";
      var minusBtn="";
      if((plant.needColonist - plant.actualColonist) == 0){
        addBtn = "<input class='add' type='button' data-index='p"+index +"' value='Plus' disabled='true'>";
      }else{
        addBtn = "<input class='add' type='button' data-index='p"+index +"' value='Plus'>";
      }
      if(plant.actualColonist == 0){
        minusBtn = "<input class='minus' type='button' data-index='p"+index+"' value='Minus' disabled='true'>";
      }else{
        minusBtn = "<input class='minus' type='button' data-index='p"+index+"' value='Minus'>";
      }
      if(myPlayer.freeColonists == 0){
        addBtn = "<input class='add' type='button' data-index='p"+index +"' value='Plus' disabled='true'>";
      }
      selectItem += "<div>"+ItemNode+addBtn+minusBtn+"</div>";
    });
    $('#element').empty().append("<p>Plant Area</p>").append(selectItem).append("<hr>");


    selectItem="";
    $.each(myPlayer.buildArea, function(index){
      var build = myPlayer.buildArea[index];
      ItemNode = build.name+".已拥有:"+build.actualColonist+"人; 残缺:"+(build.needColonist - build.actualColonist)+"人.";
      var addBtn ="";
      var minusBtn="";
      if((build.needColonist - build.actualColonist) == 0){
        addBtn = "<input class='add' type='button' data-index='b"+index +"' value='Plus' disabled='true'>";
      }else{
        addBtn = "<input class='add' type='button' data-index='b"+index +"' value='Plus'>";
      }
      if(build.actualColonist == 0){
        minusBtn = "<input class='minus' type='button' data-index='b"+index+"' value='Minus' disabled='true'>";
      }else{
        minusBtn = "<input class='minus' type='button' data-index='b"+index+"' value='Minus'>";
      }
      if(build.freeColonists == 0){
        addBtn = "<input class='add' type='button' data-index='b"+index +"' value='Plus' disabled='true'>";
      }
      selectItem += "<div>"+ItemNode+addBtn+minusBtn+"</div>";
    });
    $('#element').append("<p>Build Area</p>").append(selectItem);
}

$(document).on('click', '.add',function(){
    var indexInfo = $(this).data("index");
    var type = indexInfo.charAt(0);
    var index = indexInfo.substring(1);
    console.log("add:"+index);

    if(type == "p"){
      var plant = myPlayer.plantArea[index];
      plant.actualColonist += 1;
      myPlayer.freeColonists -= 1;
    }else if(type == "b"){
        var build = myPlayer.buildArea[index];
        build.actualColonist += 1;
        myPlayer.freeColonists -= 1;
    }
    //contentString = "请分配你的奴隶. 空闲奴隶："+myPlayer.freeColonists+"人";
    drawColonistList();
});

$(document).on('click', '.minus',function(){
    var indexInfo = $(this).data("index");
    var type = indexInfo.charAt(0);
    var index = indexInfo.substring(1);
    console.log("minus"+index);
    if(type == "p"){
        var plant = myPlayer.plantArea[index];
        plant.actualColonist -= 1;
        myPlayer.freeColonists += 1;
    }else if(type == "b"){
        var build = myPlayer.buildArea[index];
        build.actualColonist -= 1;
        myPlayer.freeColonists += 1;
    }

    //contentString = "请分配你的奴隶. 空闲奴隶："+myPlayer.freeColonists+"人";
    drawColonistList();
});
