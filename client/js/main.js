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

   socket.on('players update', function(data){
       console.log('players update: '+data.players.length);
       updatePlayers(data);
       drawLoginPage();
   });


   socket.on('start game', function(data){
       $('.loginPage').fadeOut("slow");
       $('.wrap').show();

       updateGameStatus(data);
       //console.log('start game.');
       if(myPlayer.name == data.rolePlayer){
          permit = true;
       }
   });

    ////当角色被选择时，触发click事件
    $('.role').click(function(){
      console.log($(this).data('role') +' is clicked');
      if(gameOver){
        return;
      }
      if(!permit){
          return;
      }
      if(myPlayer.name != rolePlayer){
          return;
      }


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
      permit = false;
    });


    socket.on('RoleResponse', function(data){
        updateGameStatus(data);

        if(data.nextPlayer.name != myPlayer.name){
            console.log(data.nextPlayer.name+' is not '+myPlayer.name);
            return;
        }

        $('#ConfirmBtn').show();
        $('#ConfirmBtn').prop('disabled', false);
        $('#SkipBtn').show();
        $('#OKBtn').hide();
        $('#CancelBtn').hide();

        var titleString = currentRole;
        //console.log("player name:"+myPlayer.name);
        switch (currentRole) {
          case 'Settler':
              settlerProcess(data);
              break;
          case 'Mayor':
              mayorProcess(data);
              break;
          case 'Trader':
              traderProcess(data);
              break;
          case 'Captain':
              captainProcess(data);
              break;
          case 'Builder':
              builderProcess(data);
              break;
          case 'Craftsman':
              craftsmanProcess(data);
              break;
          case 'Prospector':
              prospectorProcess(data);
              break;
          default:

        }

        $('#popupTitle').empty().text(titleString);
        $('#popup1').show();
        permit = false;
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
                    if(mySelect.extra != null){
                        sendData.extraIndex = mySelect.extra;
                    }
                }else if(btnName == "Skip"){
                    sendData.index = null;
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
                if(!shipState.clear){
                    if(btnName == "Confirm"){
                        var product = null;
                        if(mySelect.extra1 != null){
                            sendData.product = mySelect.extra1[0];
                            sendData.productNum = mySelect.extra1[1];
                            sendData.wharf = true;
                            shipState.wharf = true;
                        }else if(mySelect.select !=null){
                            sendData.product = mySelect.select[0];
                            sendData.productNum = mySelect.select[1]
                            sendData.ship = mySelect.extra;
                        }else{
                            sendData.product = "none";
                        }

                    }else{
                        sendData.product = "none";
                    }
                }else{
                    sendData.productClear = true;

                    if((mySelect.select != null)&&(mySelect.select != "all")){
                      var tmp = [0,0,0,0,0];
                      tmp[mySelect.select] = 1;
                      if(mySelect.extra != null){
                        tmp[mySelect.extra] = myPlayer.products[mySelect.extra];
                      }
                      if(mySelect.extra1 != null){
                        $.each(mySelect.extra1, function(index){
                            var i = mySelect.extra1[index];
                            tmp[i]=myPlayer.products[i];
                        });
                      }
                      myPlayer.products = tmp;
                    }
                    Messages.push("<li class='message'><span class='messageSelect'>"+myPlayer.name+"完成了货物清理。剩余货物："
                              +myPlayer.products[0]+"个corn、"
                              +myPlayer.products[1]+"个sugar、"
                              +myPlayer.products[2]+"个indigo、"
                              +myPlayer.products[3]+"个tobacco、"
                              +myPlayer.products[4]+"个coffee"
                              +"</span></li>");
                }
                break;
            case 'Builder':
                if(btnName == "Confirm"){
                    if(mySelect.select != null){
                        sendData.build = mySelect.select[0];
                        sendData.price = mySelect.select[1];
                    }else{
                        sendData.build = null;
                    }
                }else{
                    sendData.build = null;
                }
                break;
            case 'Craftsman':
                sendData.addProducts = mySelect.select;
                break;
            case 'Prospector':
                break;
            default:
                break;
        }

        if(gameOver){
          $('#element').empty();
          $('#popup1').hide();
          return;
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



    socket.on('next round', function(data){
        //change govenor player.
        console.log('next round');
        updateGameStatus(data);
        if(myPlayer.name == data.rolePlayer){
           permit = true;
        }
    });

    socket.on('next role', function(data){
        //change next player to select one role.
        console.log('next role');

        updateGameStatus(data);
        if(myPlayer.name == data.rolePlayer){
           permit = true;
        }
    });

    socket.on('game over', function(data){
        //change next player to select one role.
        console.log('game over');
        updateGameStatus(data);
        gameOver = true;
        rolePlayer = null;
        permit = false;

        $('#ConfirmBtn').show();
        $('#ConfirmBtn').prop('disabled', false);
        $('#SkipBtn').hide();
        $('#OKBtn').hide();
        $('#CancelBtn').hide();

        gameOverProcess(data);
        $('#popupTitle').empty().text("Game Over");
        $('#popup1').show();

    });

    function updateGameStatus(data){
        Messages = [];

        if(data.role != null){
          currentRole = data.role;
          if(currentRole != 'Captain'){
            shipState.wharf = false;
            shipState.clear = false;
            shipState.selected = null;
          }
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
        if(data.colonistsNum != null){
            COLONISTNUM = data.colonistsNum;
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
