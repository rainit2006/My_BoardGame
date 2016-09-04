////////////draw////////////////////////
function drawLoginPage(){
    $('#playerArea').empty();

    var ulNode = $('<ul>');
    $.each(Players, function(){
        var img = "<img src='../image/face"+this.id+".png'>";
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

function drawMyPlayer(){
  var img = "<img src='../image/face"+myPlayer.id+".png'>";
  $('.face').append(img);
  var string ="<span><img src='../image/coin.png'> "+myPlayer.money+" <img src='../image/point.png'> "+myPlayer.points+"</span>"+
          "<span><img src='../image/worker.png'> "+myPlayer.totalColonists+"(残余："+myPlayer.freeColonists+")"+
          "  <img src='../image/quarry.png'> "+myPlayer.quarry+"</span>"+
          "<span><img src='../image/corn.png'> "+myPlayer.products[0]+"<img src='../image/sugar.png'> "+myPlayer.products[1]+
            "<img src='../image/indigo.png'> "+myPlayer.products[2]+"<img src='../image/tobacco.png'> "+
            myPlayer.products[3]+"<img src='../image/coffee.png'> "+myPlayer.products[4]+"</span>";

  $('.playerState').append('<h3>'+myPlayer.name+'</h3>'+string);

  drawMyPlantArea();
  drawMyBuildArea();
}

function drawMyPlantArea(){
  var node="";
  for(var i=0; i<myPlayer.plantArea.length; i++ ){
      var plant = myPlayer.plantArea[i];
      var img = "";
      for(var j=0; j<plant.actualColonist; j++){
        img +="<img src='../image/worker.png'>";
      }
      var diff = plant.needColonist - plant.actualColonist;
      for(var j=0; j<diff; j++){
        img += "<img src='../image/vacant1.png'>";
      }
      node += "<li class='"+plant.color +"'><p>"+plant.name+"</p>"+img+"</li>";
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
      var img ="";
      for(var j=0; j<build.actualColonist; j++){
        img +="<img src='../image/worker.png'>";
      }
      var diff = build.needColonist - build.actualColonist;
      for(var j=0; j<diff; j++){
        img += "<img src='../image/vacant1.png'>";
      }
      node += "<li class='"+build.color +"'><p>"+build.name+"</p>"+img+"</li>";
      spaceLength += build.space;
  }
  for(var j=0; j < (PlantationAreaMaxNum - spaceLength); j++  ){
      node +="<li class='gray'></li>";
  }
  $('#buildArea').empty().append("<ul>"+node+"</ul>");
};



function drawOtherPlayers(){

  $('#OtherPlayersArea').empty();
  $.each(Players, function(){

      if(myPlayer.name != this.name){
          var playerDiv = $("<div id="+this.id+" class='otherPlayerArea'>");

          var img = "<div class='face'><img src='../image/face"+this.id+".png'></div>";
          // var string = "<p>"+this.name+"</p>"+"<p> money:"+this.money+"</p>"+
          //       "<p> colonists:"+this.totalColonists+"(残余："+this.freeColonists+")"+"</p>"+
          //       "<p>quarry:"+this.quarry+"</p>"+
          //       "<p>product:"+this.products[0]+";"+this.products[1]+";"+this.products[2]+";"+this.products[3]+";"+this.products[4]+"</p>";

          var string ="<h3>"+this.name+"</h3><span><img src='../image/coin.png'> "+this.money+"</span>"+
                  "<span><img src='../image/worker.png'> "+this.totalColonists+"(残余："+this.freeColonists+")"+
                  "  <img src='../image/quarry.png'> "+this.quarry+"</span>"+
                  "<span><img src='../image/corn.png'> "+this.products[0]+"<img src='../image/sugar.png'> "+this.products[1]+
                    "<img src='../image/indigo.png'> "+this.products[2]+"<img src='../image/tobacco.png'> "+
                    this.products[3]+"<img src='../image/coffee.png'> "+this.products[4]+"</span>";

          var playerStatediv = $("<div class='playerState'>"+string+"</div>");
          var playerInfo = $("<div class='playerInfo'></div>");
          playerInfo.empty().append(img).append(playerStatediv);
          playerDiv.append(playerInfo).append("<hr>");

          playerDiv.hover(
              function(){
                  var player = findPlayerByID(this.id);
                  var playerArea = $("<div id='playerArea'></div>");
                  var plantAreaDiv = $("<div id='playerPlantArea' class='filed'>");
                  drawPlantArea(plantAreaDiv, player);
                  var buildAreaDiv = $("<div id='playerBuildArea' class='filed'>");
                  drawBuildArea(buildAreaDiv, player)
                  playerDiv.empty().append(playerInfo).append(plantAreaDiv).append(buildAreaDiv).append("<hr>");
              },
              function(){
                  playerDiv.empty().append(playerInfo).append("<hr>");
              });

          $('#OtherPlayersArea').append(playerDiv);
      }
  });

}


function drawPlantArea(div, player){
  var node="";
  for(var i=0; i<player.plantArea.length; i++ ){
      var plant = player.plantArea[i];
      var img = "";
      for(var j=0; j<plant.actualColonist; j++){
        img +="<img src='../image/worker.png'>";
      }
      var diff = plant.needColonist - plant.actualColonist;
      for(var j=0; j<diff; j++){
        img += "<img src='../image/vacant1.png'>";
      }
      node += "<li class='"+plant.color +"'><p>"+plant.name+"</p>"+img+"</li>";
  }
  for(var j=0; j < (PlantationAreaMaxNum - player.plantArea.length); j++  ){
      node +="<li class='green'></li>";
  }
  div.empty().append("<ul>"+node+"</ul>");
}

function drawBuildArea(div, player){
  var node="";
  var spaceLength = 0;
  // if(player.buildArea == null){
  //   return;
  // }
  for(var i=0; i<player.buildArea.length; i++ ){
      var build = player.buildArea[i];
      var img ="";
      for(var j=0; j<build.actualColonist; j++){
        img +="<img src='../image/worker.png'>";
      }
      var diff = build.needColonist - build.actualColonist;
      for(var j=0; j<diff; j++){
        img += "<img src='../image/vacant1.png'>";
      }
      node += "<li class='"+build.color +"'><p>"+build.name+"</p>"+img+"</li>";
      spaceLength += build.space;
  }
  for(var j=0; j < (PlantationAreaMaxNum - spaceLength); j++  ){
      node +="<li class='gray'></li>";
  }
  div.empty().append("<ul>"+node+"</ul>");
};


$('#OtherPlayerArea').mouseover(function (e) {
    var target = $(this);
    // var target = $('#playerArea');
    // $(target).show();
    // moveLeft = $(this).outerWidth();
    // moveDown = ($(target).outerHeight() / 2);
}, function () {
    // var target = $('#playerArea');
    // if (!($("a.popper").hasClass("show"))) {
    //     $(target).hide(); //dont hide popup if it is clicked
    // }
});


/////////////////////////////////////
function drawGameArea(){
    drawPublicInfo();
    drawRoles();
    drawTradeArea();
    drawShipsArea();
    drawColonistShipsArea();
    drawBuildings();
}

function drawPublicInfo(){
    $("#publicInfo").html("<h3>剩余的开拓者（奴隶?）数量:"+COLONISTNUM+"</h3>");
}

function drawRoles(){
  $.each(Roles, function(){
      if(this.money > 0){
        $(".roleCoin[data-role="+this.name+"]").empty().append("<span><img src='../image/coin.png'> "+this.money+"</span>");
      }else{
        $(".roleCoin[data-role="+this.name+"]").empty();
      }
      if(this.active == 0){
        $("#"+this.name).addClass("disabled");
      }else{
        $("#"+this.name).removeClass("disabled");
      }
  });
}


function drawTradeArea(){
    $('#TradingHouse').empty();
    for(var i=0; i<TRADINGHOUSE.length; i++){
        $('#TradingHouse').append("<li class='"+TRADINGHOUSE[i].color+"'><img src='../image/"+TRADINGHOUSE[i].name+".png'></li>");
    }
    for(var i=0; i<(HOUSELENGTH-TRADINGHOUSE.length); i++){
        $('#TradingHouse').append("<li class='white'></li>");
    }

}

function drawShipsArea(){
  for(var i = 0; i<3; i++){
      $('#Ship'+i).empty();
      for(var j=0; j<SHIPS[i].num; j++){
          var plant = getPlantByName(SHIPS[i].name);
          $('#Ship'+i).append("<li class='"+plant.color+"'><img src='../image/"+plant.name+".png'></li>");
      }
      for(var j=0; j<(SHIPLENGTH[i]-SHIPS[i].num); j++){
          $('#Ship'+i).append("<li class='white'></li>");
      }
  }
}

function drawColonistShipsArea(){
  var node="";
  var length;
  if(COLONISTSHIP == null){
      length = 4;
  }else{
      length = COLONISTSHIP;
  }
  for(var i=0; i<length; i++){
      node += "<li class='white'><img src='image/worker.png'></li>";
  }
  $('#ColonistsShip').empty().append(node);
}

function drawBuildings(){
  $.each(BUILDINGS, function(index){
      if(index != 0){
          var node = "<h3>"+this.name+"</h3><p>数量："+BUILDINGSNUM[index]+"</p><p>points:"+this.points+"</p><p>price:"+this.price+"</p><p>colonist:"+this.needColonist+"</p>";
          $("#build"+index).empty().append(node);
          if(BUILDINGSNUM[index] == 0){
            $("#build"+index).addClass("gray");
          }else{
            $("#build"+index).addClass(this.color);
          }
      }
  });
}
