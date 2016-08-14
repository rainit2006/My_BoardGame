////////////draw////////////////////////
function drawLoginPage(){
    $('#playerArea').empty();

    var ulNode = $('<ul>');
    $.each(Players, function(){
        var img = "<img src='../image/face"+this.id+".jpg'>";
        var div = null;
        if(myPlayer.name == this.name){
          div = $("<li>"+img+"<div>"+this.name+"(★)</div></li>").addClass('player'+this.id);
        }else{
          div = $("<li>"+img+"<div>"+this.name+"</div></li>").addClass('player'+this.id);
        }
        ulNode.append(div);
    });
    $('#playerArea').append(ulNode);

    if(Players.length == 2){
        $('#startGame').val('Star Game with 2 player');
    }else if(Players.length == 3){
        $('#startGame').val('Star Game with 3 player');
    }else if(Players.length == 4){
        $('#startGame').val('Star Game with 4 player');
    }else if(Players.length == 5){
        $('#startGame').val('Star Game with 5 player');
    }
}

function drawPlayers(){
  drawMyPlayer();
  drawOtherPlayers();
}

function drawOtherPlayers(){
  var ulNode = $('<ul>');
  $.each(Players, function(){
      if(myPlayer.name != this.name){
          var img = "<img src='../image/face"+this.id+".jpg'>";
          var string = "<p>"+this.name+"</p>"+"<p> money:"+this.money+"</p>"+
                "<p> colonists:"+this.totalColonists+"(残余："+this.freeColonists+")"+"</p>"+
                "<p>quarry:"+this.quarry+"</p>"+
                "<p>product:"+this.products[0]+";"+this.products[1]+";"+this.products[2]+";"+this.products[3]+";"+this.products[4]+"</p>";

          var div = $("<li id="+this.id+">"+img+string+"</li>").addClass('player'+this.id);
          ulNode.append(div);
      }
  });
  $('#OtherPlayersArea').empty().append(ulNode);
}

function drawMyPlayer(){
  var img = "<img src='../image/face"+myPlayer.id+".jpg'>";
  var string ="<p> potins:"+myPlayer.points+"</p>"+"<p> money:"+myPlayer.money+"</p>"+
          "<p> colonists:"+myPlayer.totalColonists+"(残余："+myPlayer.freeColonists+")"+"</p>"+
          "<p>quarry:"+myPlayer.quarry+"</p>"+
          "<p>product:"+myPlayer.products[0]+";"+myPlayer.products[1]+";"+myPlayer.products[2]+";"+myPlayer.products[3]+";"+myPlayer.products[4]+"</p>";

  $('#MyPlayerArea').empty().append(img+'<h3>'+myPlayer.name+'</h3>'+string).addClass('player'+myPlayer.id);

  drawMyPlantArea();
  drawMyBuildArea();
}

function drawMyPlantArea(){
  var node="";
  for(var i=0; i<myPlayer.plantArea.length; i++ ){
      var plant = myPlayer.plantArea[i];
      node += "<li class='"+plant.color +"'><p>"+plant.name
              +"</p>已有奴隶："+plant.actualColonist+";"
              +"空缺奴隶："+(plant.needColonist - plant.actualColonist)+"</li>";
  }
  for(var j=0; j < (PlantationAreaMaxNum - myPlayer.plantArea.length); j++  ){
      node +="<li class='green'></li>";
  }
  $('#plantArea').empty().append("<ul>"+node+"</ul>");
}

function drawMyBuildArea(){
  var node="";
  var spaceLength = 0;
  // if(myPlayer.buildArea == null){
  //   return;
  // }
  for(var i=0; i<myPlayer.buildArea.length; i++ ){
      var build = myPlayer.buildArea[i];
      node += "<li class='"+build.color +"'><p>"+build.name
              +"</p>已有奴隶："+build.actualColonist+";"
              +"空缺奴隶："+(build.needColonist - build.actualColonist)+"</li>";
      spaceLength += build.space;
  }
  for(var j=0; j < (PlantationAreaMaxNum - spaceLength); j++  ){
      node +="<li class='gray'></li>";
  }
  $('#buildArea').empty().append("<ul>"+node+"</ul>");
};
/////////////////////////////////////
function drawShipsArea(){
  for(var i = 0; i<3; i++){
      $('#Ship'+i).empty();
      for(var j=0; j<SHIPS[i].num; j++){
          $('#Ship'+i).append("<li>"+SHIPS[i].name+"</li>");
      }
      for(var j=0; j<(SHIPLENGTH[i]-SHIPS[i].num); j++){
          $('#Ship'+i).append("<li></li>");
      }
  }
}

function drawColonistShipsArea(){
  $('ColonistsShip').empty().append('<p>奴隶数:'+COLONISTSHIP+'</p>');
}

function drawBuildings(){

}
