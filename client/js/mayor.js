//////Mayor//////
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
        addBtn = "<input class='add' type='button' data-index='"+index +"' value='Plus' disabled='true'>";
      }else{
        addBtn = "<input class='add' type='button' data-index='"+index +"' value='Plus'>";
      }
      if(plant.actualColonist == 0){
        minusBtn = "<input class='minus' type='button' data-index='"+index+"' value='Minus' disabled='true'>";
      }else{
        minusBtn = "<input class='minus' type='button' data-index='"+index+"' value='Minus'>";
      }
      selectItem += "<div>"+ItemNode+addBtn+minusBtn+"</div>";
    });
    $('#element').empty().append(selectItem);


}

$(document).on('click', '.add',function(){
    var index = $(this).data("index");
    console.log("add:"+index);
    var plant = myPlayer.plantArea[index];
    plant.actualColonist += 1;
    myPlayer.freeColonists -= 1;
    contentString = "请分配你的奴隶. 空闲奴隶："+myPlayer.freeColonists+"人";
    drawColonistList();
});

$(document).on('click', '.minus',function(){
    var index = $(this).data("index");
    console.log("minus"+index);
    var plant = myPlayer.plantArea[index];
    plant.actualColonist -= 1;
    myPlayer.freeColonists += 1;
    contentString = "请分配你的奴隶. 空闲奴隶："+myPlayer.freeColonists+"人";
    drawColonistList();
});
