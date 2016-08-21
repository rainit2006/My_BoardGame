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
      drawPlayers();
      drawGameArea();

      console.log("init done.");
    }


    $('#enter').click(function(){
        username = cleanInput($('.usernameInput').val().trim());
        if (username) {
            $('.loginForm').fadeOut("slow");
            $('.startForm').show();
            socket.emit('new player join', username);
            myPlayer.name = username;
        }
    });



    $('#startGame').click(function(){
      socket.emit('start game');
    });

    // Prevents input from having injected markup
   function cleanInput (input) {
      return $('<div/>').text(input).text();
   }

   socket.on('start game', function(data){
       $('.loginPage').fadeOut("slow");
       $('.wrap').show();
       //initWrap();
       updateGameStatus(data);
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
        updateGameStatus(data);

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
                    sendData.index=mySelect.select;
                    //console.log("selected plant :"+options[mySelect.select].name);
                    var plant = PLANTS[mySelect.select];
                    // myPlayer.plantArea.push(plant);
                    // if(options[mySelect.select].name == 'quarry'){
                    //     myPlayer.quarry += 1;
                    // }
                    Messages.push("<li class='message'><span class='messageSelect'>"+myPlayer.name+"选择了"+plant.name+".</span></li>");
                    if(mySelect.extra != null){
                        sendData.extraIndex = mySelect.extra;
                        var plant = PLANTS[mySelect.extra];
                        Messages.push("<li class='message'><span class='messageSelect'>"+myPlayer.name+"因为有【农庄】所以额外获得一个"+plant.name+".</span></li>");
                    }

                }else if(btnName == "Skip"){
                    sendData.index = null;
                    Messages.push("<li class='message'><span class='messageSelect'>"+data.player.name+"放弃了选择.</span></li>");
                }
                console.log(sendData.index+':'+options[mySelect.select]+' is clicked!');
                break;
            case 'Mayor':
                //没有什么特别要处理的
                break;
            case 'Trader':
                if(btnName == "Confirm"){
                    sendData.product = mySelect.select;
                }
                break;
            case 'Captain':
                if(btnName == "Confirm"){
                    sendData.product = PLANTS[mySelect.select[0]].id;
                    sendData.productNum = mySelect.select[2];
                    sendData.ship = mySelect.select[1];
                }
                break;
            case 'Builder':
                if(btnName == "Confirm"){
                    sendData.build = mySelect.select[0];
                    myPlayer.buildArea.push(BUILDINGS[sendData.build]);
                    sendData.price = mySelect.select[1];
                }else{
                    sendData.build = null;
                }
                break;
            default:
        }
        sendData.player = myPlayer;
        sendData.role = currentRole;
        sendData.messages = Messages;
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

    function updateGameStatus(data){
        Messages = [];

        if(data.role != null){
          currentRole = data.role;
        }

        if(data.roles != null){
          Roles = data.roles;
          drawRoles();
        }
        if(data.rolePlayer != null){
          rolePlayer = data.rolePlayer;
        }

        //show message.
        if(data.messages != null){
            showMessage(data);
        }
        // if(data.player != null){
        //   updatePlayer(data.player);
        // }
        if(data.ships != null){
            SHIPS = data.ships;
        }
        if(data.colonistsShip != null){
            COLONISTSHIP = data.colonistsShip;
        }
        if(data.buildingsNum != null){
           BUILDINGSNUM  = data.buildingsNum;
        }
        if(data.tradingHouse != null){
          TRADINGHOUSE = data.tradingHouse;
        }
        updatePlayers(data);

        ///draw
        drawPlayers();
        drawGameArea();
    }

    socket.on('players update', function(data){
        console.log('players update: '+data.players.length);
        updatePlayers(data);
        drawLoginPage();
    });

    socket.on('next round', function(data){
        //change govenor player.
        console.log('next round');
        updateGameStatus(data);
    });

    socket.on('next role', function(data){
        //change next player to select one role.
        console.log('next role');

        updateGameStatus(data);
    });


    // function updatePlayer(player){
    //     if(player.name == myPlayer. name){
    //         myPlayer = player;
    //     }else{
    //         var index = findPlayerbyName(player.name);
    //         Players[index] = player;
    //     }
    // }


    function updatePlayers(data){
        if(data == null){
            console.log("updatePlayers failed: data is null");
            return;
        }
        if(data.players != null){
            Players = data.players;
            $.each(data.players, function(index){
              if(myPlayer.name == data.players[index].name){
                  myPlayer = data.players[index];
                  if(myPlayer == null){
                    console.log("ERR: myPlayer is null!");
                  }
              }else{
                  var index = findPlayerbyName(data.players[index].name);
                  Players[index] = data.players[index];
              }
            });
        }
        if((data.player != null)){
            if(myPlayer.name == data.player.name){
                myPlayer = data.player;
                if(myPlayer == null){
                  console.log("ERR: myPlayer is null!");
                }
            }else{
                var index = findPlayerbyName(data.player.name);
                Players[index] = data.player;
            }
        }
        if(data.nextPlayer != null){
          if(myPlayer.name == data.nextPlayer.name){
              myPlayer = data.nextPlayer;
          }else{
              var index = findPlayerbyName(data.nextPlayer.name);
              Players[index] = data.nextPlayer;
          }
        }

        if((data.players == null)&&(data.player == null)){
            console.log("updatePlayers failed: data.players/player are null");
            return;
        }
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
