$(function() {
    var socket = io();

    var BuildingAreaMaxNum = 12;
    var PlantationAreaMaxNum = 12;

    var Action={//记录玩家的操作
        index_GameItems:null,
        index_Filed:null,
        id:null
    };
    var MAX_PLAYER = 5;
    var Players = [];
    var myPlayer = {
        name: 'test',
        id: 0,
        select:null,
        product:[0,0,0,0,0],
        plantArea:[],
        buildArea:[]
    };
    var playerNum = 1;
    var currentRole = null;
    var options = null;



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
        // MyBuildingArray=[];
        // MyPlantationArray=[];
        // for(var i = 0; i < BuildingAreaMaxNum; i ++){
        //     MyBuildingArray.push(["空地", 0]); //param： 建筑种类，奴隶数
        // }
        // for(var i = 0; i < PlantationAreaMaxNum; i ++){
        //     MyBuildingArray.push(["空地"]); //param： 土地种类
        // }
    }

    function drawPlayers(){
      console.log('drawPlayers');
      var ulNode = $('<ul>');
      $.each(Players, function(){
          var div = null;
          var string = null;
          string = "<p> money:"+this.money+"</p>"+
                  "<p> colonists:"+this.colonists+"</p>";

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
        // var ulNode = $("<ul id='FiledAreaNode'>");
        // $.each(FiledArray, function(){
        //       //ulNode.append("<li>"+this[0]+":"+this[1]+"</li>");
        //       var liNode = $("<li>"+this[0]+"</li>");
        //       if(this[1] === 0){
        //           liNode.addClass('vacant');
        //       }
        //       if(this[1] === 1){
        //           liNode.addClass('player1');
        //       }
        //       if(this[1] === 2){
        //           liNode.addClass('player2');
        //       }
        //       if(this[1] === 3){
        //           liNode.addClass('player3');
        //       }
        //       if(this[1] === 4){
        //           liNode.addClass('player4');
        //       }
        //       if(this[1] === 5){
        //           liNode.addClass('player5');
        //       }
        //       ulNode.append(liNode);
        // });
        // $("#FiledArea").empty().append(ulNode);
    }

    function drawPlantArea(){
      var node="";
      for(var i=0; i<myPlayer.plantArea.length; i++ ){
          node += "<li class='"+myPlayer.plantArea[i].color +"'>"+myPlayer.plantArea[i].name+"</li>";
      }
      for(var j=0; j < (PlantationAreaMaxNum - myPlayer.plantArea.length); j++  ){
          node +="<li class='green'></li>";
      }
      $('#plantArea').append("<ul>"+node+"</ul>");
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
      if(Players == null){
        return id;
      }
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
      currentRole = 'Settler';
      var sendData={};
      sendData.role = currentRole;
      sendData.player = myPlayer;
      socket.emit('gameRoleSelect', sendData);
      console.log('Settler');
    });

    $('#Trader').click(function(){

      // $('#ConfirmBtn').hide();
      // $('#SkipBtn').hide();
      // $('#OKBtn').show();
      // $('#CancelBtn').show();
      // $('#popupTitle').text("选择角色");
      //
      // $('#popup1').show();

      var sendData = {};
      currentRole = 'Trader'
      sendData.role = currentRole;
      //玩家的product区域被激活
      $.each($('#productUL'), function(){
          console.log(this);
      });

      socket.emit('gameRoleSelect', sendData);
      console.log('Trader');
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

    $('#ConfirmBtn').click(function(){
        //console.log("button clicked");
        //alert("confirm Btn clicked!");
        switch (currentRole) {
            case 'Settler':
                var sendData={};
                sendData.index=options[myPlayer.select].id;
                myPlayer.plantArea.push(options[myPlayer.select]);
                sendData.player = myPlayer;
                sendData.role = "Settler";
                console.log(sendData.index+':'+options[myPlayer.select].name+' is clicked!');
                socket.emit('player select', sendData);
                drawPlantArea();
                break;
            default:
        }
        $('#popup1').hide();
    });

    socket.on('update', function(data){
        Action = data;
        console.log('updated.'+Action.index_GameItems+';'+Action.index_Filed);

        updateGameStatus();

    });

    socket.on('players update', function(data){
        Players = data.players;
        console.log('players update: '+Players.length);
        drawLoginPage();
    });

    socket.on('start game', function(){
        $('.loginPage').fadeOut("slow");
        $('.wrap').show();
        initWrap();

        console.log('start game.');
    });

    socket.on('next round', function(data){
        //change govenor player.
        console.log('next round');
    });

    socket.on('next role', function(data){
        //change next player to select one role.
        console.log('next role');
    });

    socket.on('SettlerResponse', function(data){
        //plantOptions = null;
        console.log('SettlerResponse');
        if(data.nextPlayer.name != myPlayer.name){
            console.log(data.nextPlayer.name+' is not '+myPlayer.name);
            return;
        }
        console.log("player name:"+myPlayer.name);
        options = data.options;
        currentRole = data.role;
        //console.log('plant options:'+options);

        $('#ConfirmBtn').show();
        $('#SkipBtn').show();
        $('#OKBtn').hide();
        $('#CancelBtn').hide();
        $('#popupTitle').text("Settler");
        $('#message').text("请选择你想要的plant.");

        var ulNode= $("<ul id='PlantationUL'>");
        $.each(options, function(index){
            //plantOptions.push(this.name);
            var div = $("<li id="+index+">"+this.name+"</li>").addClass(this.color);
            ulNode.append(div);
        });
        $('#element').empty().append(ulNode);

        $('#element li').on('click', function(){
            ///判断操作的player是不是有效的当前player，如果是则传给服务器data。
            myPlayer.select = this.id;
            $('#message').text("请选择你想要的plant.").append("<p>你选择的是："+options[this.id].name+"</p>");
        });
        $('#popup1').show();
    });

    socket.on('TraderResponse', function(data){

        //玩家click货物时，发送消息
        // $('#productUL li').on('click', function(){
        //     ///判断操作的player是不是有效的当前player，如果是则传给服务器data。
        //     var sendData={};
        //     sendData.name = $(this).text();
        //     sendData.index=this.id;
        //     myPlayer.plantArea.push(options[index]);
        //     sendData.player = myPlayer;
        //     sendData.role = "SettlerResponse";
        //     console.log(sendData.index+':'+sendData.name+' is clicked!');
        //     socket.emit('plant selected', sendData);
        // });
    });

    socket.on('MayorResponse', function(data){
        //自动分配奴隶数给玩家
        var colonistsNum = data.colonists;
        var playerNum = data.playerNum;
        var colonists = colonistsNum/playerNum;
        //玩家选择奴隶的分配（点击plantArea或BuildArea），然后把player状态发给server。
        var sendData = {};
        sendData.role = 'Mayor';
        socket.emit('plant selected', sendData);
    });

    socket.on('CaptainResponse', function(data){
        //玩家选择货物和船
    });

    socket.on('BuilderResponse', function(data){
        //玩家选择建筑物
    });

    socket.on('CraftsmanResponse', function(data){
        //计算好myPlayer玩家的生成货物，告诉给server
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
