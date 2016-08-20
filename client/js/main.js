///////////////////////////////////
$(function() {
    var socket = io();

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
      drawRoles();
      drawPlayers();
      drawBuildings();
      drawTradeArea();
      drawShipsArea();
      drawColonistShipsArea();
      bindClickEvent();

      console.log("init done.");
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

    // Prevents input from having injected markup
   function cleanInput (input) {
      return $('<div/>').text(input).text();
   }

   socket.on('start game', function(){
       $('.loginPage').fadeOut("slow");
       $('.wrap').show();
       initWrap();

       console.log('start game.');
   });

    // $('#SubmitArea input:button').click(function(){
    //     //console.log("button clicked");
    //     var index_GameItems = Action.index_GameItems;
    //     var index_Filed = Action.index_Filed;
    //     console.log(index_GameItems+";"+index_Filed);
    //     Action.id = myPlayer.id;
    //
    //     //updateGameStatus();
    //
    //     socket.emit('submit', Action);
    //
    // });

    ////当角色被选择时，触发click事件
    $('.role').click(function(){
      console.log($(this).data('role') +' is clicked');

      var selected = $(this).data('role');
      if(checkRoleActivity(selected) == 0){
          return;
      }
      currentRole = selected;
      var sendData={};
      sendData.role = currentRole;
      sendData.player = myPlayer;
      if(currentRole == 'Mayor'){
          ///需要在client里先计算，以便分配人员。
          myPlayer.freeColonists += 1;
      }
      socket.emit('gameRoleSelect', sendData);
    });


    socket.on('RoleResponse', function(data){
        currentRole = data.role;
        if(data.roles != null){
          Roles = data.roles;
          drawRoles();
        }

        //plantOptions = null;
        console.log('RoleResponse:'+currentRole+';'+data.nextPlayer.name);
        //show message.
        if(data.message != null){
            showMessage(data);
        }
        if(data.player != null){
          var index = findPlayerbyName(data.player.name);
          Players[index] = data.player;
        }
        if(data.ships != null){
            SHIPS = data.ships;
        }
        if(data.colonistsShip != null){
            COLONISTSHIP = data.colonistsShip;
        }
        if(data.buildingsNum != null){
           BUILDINGSNUM  = data.buildingsNum;
        }
        updatePlayers(data);
        drawPlayers();
        drawBuildings();
        if(data.nextPlayer.name != myPlayer.name){
            console.log(data.nextPlayer.name+' is not '+myPlayer.name);
            return;
        }

        var titleString = currentRole;
        //console.log("player name:"+myPlayer.name);
        switch (currentRole) {
          case 'Settler':
              settlerProcess(data);
              break;
          case 'Mayor':
              mayorProcess(data);
              drawColonistShipsArea();
              break;
          case 'Trader':
              traderProcess(data);
              break;
          case 'Captain':
              captainProcess(data);
              drawShipsArea();
              break;
          case 'Builder':
              builderProcess(data);
              break;
          case 'Craftsman':
              craftsmanProcess(data);
              break;
          case 'Prospector':
              break;
          default:

        }
        $('#ConfirmBtn').show();
        $('#SkipBtn').show();
        $('#OKBtn').hide();
        $('#CancelBtn').hide();
        $('#popupTitle').empty().text(titleString);
        $('#popup1').show();

    });


    $('.popupBtn').click(function(){
        //console.log("button clicked");
        //alert("confirm Btn clicked!");
        var btnName = $(this).data('btn');
        var sendData={};
        switch (currentRole) {
            case 'Settler':
                if(btnName == "Confirm"){
                    sendData.index=options[myPlayer.select].id;
                    console.log("selected plant :"+options[myPlayer.select].name);
                    myPlayer.plantArea.push(options[myPlayer.select]);
                    if(options[myPlayer.select].name == 'quarry'){
                        myPlayer.quarry += 1;
                    }
                }else if(btnName == "Skip"){
                    sendData.index = 0;
                }
                console.log(sendData.index+':'+options[myPlayer.select]+' is clicked!');
                break;
            case 'Mayor':
                //没有什么特别要处理的
                break;
            case 'Trader':
                if(btnName == "Confirm"){
                    sendData.product = myPlayer.select;
                }
                break;
            case 'Captain':
                if(btnName == "Confirm"){
                    sendData.product = PLANTS[myPlayer.select[0]].id;
                    sendData.productNum = myPlayer.select[2];
                    sendData.ship = myPlayer.select[1];
                }
                break;
            case 'Builder':
                if(btnName == "Confirm"){
                    sendData.build = myPlayer.select[0];
                    myPlayer.buildArea.push(BUILDINGS[sendData.build]);
                    sendData.price = myPlayer.select[1];
                }else{
                    sendData.build = null;
                }
                break;
            default:
        }
        sendData.player = myPlayer;
        sendData.role = currentRole;

        socket.emit('player select', sendData);
        drawPlayers();


        $('#element').empty();
        $('#popup1').hide();
    });

    // socket.on('update', function(data){
    //     Action = data;
    //     console.log('updated.'+Action.index_GameItems+';'+Action.index_Filed);
    //
    //     updateGameStatus();
    //
    // });

    socket.on('players update', function(data){
        Players = data.players;
        BUILDINGSNUM = data.buildingsNum;
        console.log('players update: '+Players.length);
        drawLoginPage();
        drawBuildings();
    });

    socket.on('next round', function(data){
        //change govenor player.
        console.log('next round');
        //show message.
        if(data.message != null){
            showMessage(data);
        }
        if(data.roles != null){
          Roles = data.roles;
          drawRoles();
        }

        SHIPS = data.ships;
        COLONISTSHIP = data.colonistsShip;
        drawPlayers();
        drawShipsArea();
        drawColonistShipsArea();
        drawBuildings();
    });

    socket.on('next role', function(data){
        //change next player to select one role.
        console.log('next role');
        //show message.
        if(data.message != null){
            showMessage(data);
        }

        updatePlayers(data);
        drawPlayers();
        drawBuildings();
        if(data.tradingHouse != null){
          TRADINGHOUSE = data.tradingHouse;
          drawTradeArea();
        }
    });


    // socket.on('TraderResponse', function(data){
    //
    //     //玩家click货物时，发送消息
    //     // $('#productUL li').on('click', function(){
    //     //     ///判断操作的player是不是有效的当前player，如果是则传给服务器data。
    //     //     var sendData={};
    //     //     sendData.name = $(this).text();
    //     //     sendData.index=this.id;
    //     //     myPlayer.plantArea.push(options[index]);
    //     //     sendData.player = myPlayer;
    //     //     sendData.role = "SettlerResponse";
    //     //     console.log(sendData.index+':'+sendData.name+' is clicked!');
    //     //     socket.emit('plant selected', sendData);
    //     // });
    // });
    //
    // socket.on('MayorResponse', function(data){
    //     //自动分配奴隶数给玩家
    //     var colonistsNum = data.colonists;
    //     var playerNum = data.playerNum;
    //     var colonists = colonistsNum/playerNum;
    //     //玩家选择奴隶的分配（点击plantArea或BuildArea），然后把player状态发给server。
    //     var sendData = {};
    //     sendData.role = 'Mayor';
    //     socket.emit('plant selected', sendData);
    // });
    //
    // socket.on('CaptainResponse', function(data){
    //     //玩家选择货物和船
    // });
    //
    // socket.on('BuilderResponse', function(data){
    //     //玩家选择建筑物
    // });
    //
    // socket.on('CraftsmanResponse', function(data){
    //     //计算好myPlayer玩家的生成货物，告诉给server
    // });
    function updatePlayers(data){
        if(data == null){
            console.log("updatePlayers failed: data is null");
            return;
        }
        if(data.players != null){
            $.each(data.players, function(index){
              if(myPlayer.name == data.players[index].name){
                  myPlayer = data.player[index];
              }else{
                  var index = findPlayerbyName(data.players[index].name);
                  Players[index] = data.players[index];
              }
            });
        }
        if((data.player != null)){
            if(myPlayer.name == data.player.name){
                myPlayer = data.player;
            }else{
                var index = findPlayerbyName(data.player.name);
                Players[index] = data.player;
            }
        }

        if((data.players == null)&&(data.player == null)){
            console.log("updatePlayers failed: data.players/player are null");
            return;
        }
    }

    function updateGameStatus(){
      var i = Action.index_GameItems;
      var j = Action.index_Filed;
      GameItemsArray[i][1] = GameItemsArray[i][1] - 1;
      FiledArray[j][0] = GameItemsArray[i][0];
      FiledArray[j][1] = Action.id;

      bindClickEvent();
    }

    function findPlayerbyName(name){
      for(var i= 0; i<Players.length; i++){
          if(Players[i].name == name)
            return i;
      }
    }

    function checkRoleActivity(role){
      var result = 0;
      $.each(Roles, function(){
          if(this.name == role){
              if(this.active == 1){
                result = 1;
              }else{
                 result = 0;
              }
          }
      });
      return result;
    }
})
