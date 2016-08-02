$(function() {
    var socket = io();


    var BuildingAreaMaxNum = 12;
    var PlantationAreaMaxNum = 12;
    var MyBuildingArray = [];
    var MyPlantationArray = [];

    var Action={//记录玩家的操作
        index_GameItems:null,
        index_Filed:null,
        id:null
    };
    var MAX_PLAYER = 5;
    var Players = [];
    var myPlayer = {
        name: 'test',
        id: 0
    };
    //var plantOptions = [];//记录settle角色时的plantation选项；
    //var plantSelected = []; //记录被选中的plantation；

    var playerAction = {
      role: null
    };

    window.onload = function(){
        //socket.emit('connect');

        initLoginPage();
    }

    function initLoginPage(){
        $('.usernameInput').focus();
        Players = [];
        myPlayer.name = null;
        myPlayer.id = null;
    }

    function initWrap(){
      drawLoginPage();
      initGameItems();
      initArea();
      drawPlayers();
      drawGameItemsArea();
      drawFiledArea();
      bindClickEvent();

      console.log("init done.");
    }



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

    function initGameItems(){
    }

    function initArea(){
        MyBuildingArray=[];
        MyPlantationArray=[];
        for(var i = 0; i < BuildingAreaMaxNum; i ++){
            MyBuildingArray.push(["空地", 0]); //param： 建筑种类，奴隶数
        }
        for(var i = 0; i < PlantationAreaMaxNum; i ++){
            MyBuildingArray.push(["空地"]); //param： 土地种类
        }
    }

    function drawPlayers(){
      console.log('drawPlayers');
      var ulNode = $('<ul>');
      $.each(Players, function(){
          var div = null;
          var string = null;
          string = "<p> money:"+this.money+"</p>"+
                  "<p> colonists:"+this.colonists+"</p>"+
                  "<p> corn:"+this.corn+"</p>"+
                  "<p> indigo:"+this.indigo+"</p>"+
                  "<p> sugar:"+this.sugar+"</p>"+
                  "<p> tabacco:"+this.tabacco+"</p>"+
                  "<p> coffee:"+this.coffee+"</p>";

          if(myPlayer.name == this.name){
              string ="<p> potins:"+this.points+"</p>"+string;
              $('#MyPlayerArea').empty().append('<h3>'+this.name+'</h3>'+string).addClass('player'+myPlayer.id);
          }else{
              div = $("<li id="+this.id+">"+string+"</li>").addClass('player'+this.id);
              ulNode.append(div);
          }
      });
      $('#OtherPlayersArea').empty().append(ulNode);
    }

    function drawGameItemsArea() {
        // var ulNode = $("<ul id='GameItemsUlNode'>");
        // $.each(GameItemsArray, function(){
        //       //ulNode.append("<li>"+this[0]+":"+this[1]+"</li>");
        //       var liNode = $("<li class='GameItems'>"+this[0]+":"+this[1]+"</li>");
        //       if(this[2] === 0){
        //           liNode.attr('disabled', true);
        //       }
        //       ulNode.append(liNode);
        // });
        // $("#GameItemsArea").empty().append(ulNode);
    }

    function drawFiledArea(){
        var ulNode = $("<ul id='FiledAreaNode'>");
        $.each(FiledArray, function(){
              //ulNode.append("<li>"+this[0]+":"+this[1]+"</li>");
              var liNode = $("<li>"+this[0]+"</li>");
              if(this[1] === 0){
                  liNode.addClass('vacant');
              }
              if(this[1] === 1){
                  liNode.addClass('player1');
              }
              if(this[1] === 2){
                  liNode.addClass('player2');
              }
              if(this[1] === 3){
                  liNode.addClass('player3');
              }
              if(this[1] === 4){
                  liNode.addClass('player4');
              }
              if(this[1] === 5){
                  liNode.addClass('player5');
              }
              ulNode.append(liNode);
        });
        $("#FiledArea").empty().append(ulNode);
    }


    function bindClickEvent(){
    //   $('#GameItemsUlNode li').on('click', function(){
    //       var index = $('#GameItemsUlNode li').index(this);
    //       console.log(GameItemsArray[index][0]+','+GameItemsArray[index][1] +' is clicked!');
    //       Action.index_GameItems = index;
    //   });
    //
    //   $('#FiledAreaNode li').on('click', function(){
    //       var index = $('#FiledAreaNode li').index(this);
    //       console.log(index+':'+FiledArray[index][0]+','+FiledArray[index][1] +' is clicked!');
    //       Action.index_Filed =index;
    //   });
    }

    $('#enter').click(function(){
        username = cleanInput($('.usernameInput').val().trim());
        if (username) {
            $('.loginForm').fadeOut("slow");
            $('.startForm').show();

            myPlayer.name = username;
            myPlayer.id = createPlayerID();

            socket.emit('new player add', myPlayer);
        }
    });

    function createPlayerID(){
      var id = 1;
      for(var i=1; i <= MAX_PLAYER; i++){
          var found = false;
          for(var j=0; j < Players.length; j++){
              if(Players[j].id == i){
                  found = true;
                  break;
              }
          }
          if(!found){
            id=i;
            break;
          }
      }
      return id;
    }


    $('#startGame').click(function(){
      socket.emit('start game');
    });

    $('#Settler').click(function(){
      playerAction.role = 'Settler';
      socket.emit('gameRoleSelect', playerAction);
      console.log('Settler');
    });

    // Prevents input from having injected markup
   function cleanInput (input) {
      return $('<div/>').text(input).text();
   }



    $('#SubmitArea input:button').click(function(){
        //console.log("button clicked");
        var index_GameItems = Action.index_GameItems;
        var index_Filed = Action.index_Filed;
        console.log(index_GameItems+";"+index_Filed);
        Action.id = myPlayer.id;

        //updateGameStatus();

        socket.emit('submit', Action);

    });

    socket.on('update', function(data){
        Action = data;
        console.log('updated.'+Action.index_GameItems+';'+Action.index_Filed);

        updateGameStatus();

    });

    socket.on('players update', function(data){
        Players = data;
        console.log('players update: '+Players.length);
        drawLoginPage();
    });

    socket.on('start game', function(){
        $('.loginPage').fadeOut("slow");
        $('.wrap').show();
        initWrap();

        console.log('start game.');
    });

    socket.on('next round', function(){
        //change govenor player.

    });

    socket.on('next role', function(){
        //change next player to select one role.

    });

    socket.on('next player action', function(){

    });

    socket.on('SettlerResponse', function(data){
        //plantOptions = null;
        var options = data.options;
        console.log('plant options:'+options);
        var ulNode= $("<ul id='PlantationUL'>");
        $.each(options, function(index){
            //plantOptions.push(this.name);
            var div = $("<li id="+index+">"+this.name+"</li>").addClass(this.color);
            ulNode.append(div);
        });
        $('#PlantationTile').empty().append(ulNode);

        $('#PlantationUL li').on('click', function(){
            ///判断操作的player是不是有效的当前player，如果是则传给服务器data。
            var sendData={};
            sendData.name = $(this).text();
            sendData.index=this.id;
            sendData.player = myPlayer.id;
            console.log(sendData.index+':'+sendData.name+' is clicked!');
            socket.emit('plant selected', sendData);
        });
    });


    function updateGameStatus(){
      var i = Action.index_GameItems;
      var j = Action.index_Filed;
      GameItemsArray[i][1] = GameItemsArray[i][1] - 1;
      FiledArray[j][0] = GameItemsArray[i][0];
      FiledArray[j][1] = Action.id;

      drawGameItemsArea();
      drawFiledArea();
      bindClickEvent();
    }
})
