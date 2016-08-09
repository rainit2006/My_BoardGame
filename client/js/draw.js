////////////draw////////////////////////
    function drawLoginPage(){
        $('#playerArea').empty();
        var ulNode = $('<ul>');
        $.each(Players, function(){
            var div = null;
            if(myPlayer.name == this.name){
              div = $("<li>"+this.name+"(★)</li>").addClass('player'+this.id);
            }else{
              div = $("<li>"+this.name+"</li>").addClass('player'+this.id);
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
              var string = "<p>"+this.name+"</p>"+"<p> money:"+this.money+"</p>"+
                    "<p> colonists:"+this.totalColonists+"(残余："+this.freeColonists+")"+"</p>"+
                    "<p>quarry:"+this.quarry+"</p>"+
                    "<p>product:"+this.products[0]+";"+this.products[1]+";"+this.products[2]+";"+this.products[3]+";"+this.products[4]+"</p>";

              vardiv = $("<li id="+this.id+">"+string+"</li>").addClass('player'+this.id);
              ulNode.append(div);
          }
      });
      $('#OtherPlayersArea').empty().append(ulNode);
    }

    function drawMyPlayer(){
      var string ="<p> potins:"+myPlayer.points+"</p>"+"<p> money:"+myPlayer.money+"</p>"+
              "<p> colonists:"+myPlayer.totalColonists+"(残余："+myPlayer.freeColonists+")"+"</p>"+
              "<p>quarry:"+myPlayer.quarry+"</p>"+
              "<p>product:"+myPlayer.products[0]+";"+myPlayer.products[1]+";"+myPlayer.products[2]+";"+myPlayer.products[3]+";"+myPlayer.products[4]+"</p>";

      $('#MyPlayerArea').empty().append('<h3>'+myPlayer.name+'</h3>'+string).addClass('player'+myPlayer.id);

      drawMyPlantArea();
      drawMyBuildArea();
    }

    function drawMyPlantArea(){
      var node="";
      for(var i=0; i<myPlayer.plantArea.length; i++ ){
          var plant = myPlayer.plantArea[i];
          node += "<li class='"+plant.color +"'><p>"+plant.name
                  +"</p>已有："+plant.actualColonist+";"
                  +"空缺："+(plant.needColonist - plant.actualColonist)+"</li>";
      }
      for(var j=0; j < (PlantationAreaMaxNum - myPlayer.plantArea.length); j++  ){
          node +="<li class='green'></li>";
      }
      $('#plantArea').empty().append("<ul>"+node+"</ul>");
    }

    function drawMyBuildArea(){

    };
/////////////////////////////////////
