$(function() {
    var socket = io();

    var GameItemsArray = [];
    var FiledArray = [];
    var FiledLength = 10;
    var Action={//记录玩家的操作
        index_GameItems:null,
        index_Filed:null
    };
    var MAX_PLAYER = 5;
    var PlayerArray = [];
    var myPlayer = {
        name: null,
        id: null
    };

    window.onload = function(){
        //socket.emit('connect');

        initLoginPage();
    }

    function initLoginPage(){
        $('.usernameInput').focus();
        PlayerArray = [];
        myPlayer.name = null;
        myPlayer.id = null;
    }

    function initWrap(){
      drawLoginPage();
      initGameItems();
      initFiled();
      drawPlayer();
      drawGameItemsArea();
      drawFiledArea();
      bindClickEvent();

      console.log("init done.");
    }



    function drawLoginPage(){
        $('#playerArea').empty();
        var ulNode = $('<ul>');
        $.each(PlayerArray, function(){
            var div = null;
            if(myPlayer.name == this.name){
              div = $("<li>"+this.name+"(★)</li>").addClass('player'+this.id);
            }else{
              div = $("<li>"+this.name+"</li>").addClass('player'+this.id);
            }
            ulNode.append(div);
        });
        $('#playerArea').append(ulNode);

        if(PlayerArray.length == 2){
            $('#startGame').val('Star Game with 2 player');
        }else if(PlayerArray.length == 3){
            $('#startGame').val('Star Game with 3 player');
        }else if(PlayerArray.length == 4){
            $('#startGame').val('Star Game with 4 player');
        }else if(PlayerArray.length == 5){
            $('#startGame').val('Star Game with 5 player');
        }
    }

    function initGameItems(){
        GameItemsArray = [];
        GameItemsArray.push(["玉米", 5, 1]); // "1" stands for "Enable".
        GameItemsArray.push(["咖啡", 9, 1]);
        GameItemsArray.push(["item3", 3, 1]);
        GameItemsArray.push(["item4", 3, 0]);
    }

    function initFiled(){
        FiledArray=[];
        for(var i = 0; i < FiledLength; i ++){
            FiledArray.push(["空地", 0, 0 ]); //param： 土地种类，归属者，数量
        }
    }

    function drawPlayer(){
      $('#MyPlayerArea').empty().append('<h3>'+myPlayer.name+'</h3>').addClass('player'+myPlayer.id);

      $('#OtherPlayersArea').empty();
      var ulNode = $('<ul>');
      $.each(PlayerArray, function(){
          var div = null;
          if(myPlayer.name != this.name){
            div = $("<li>"+this.name+"</li>").addClass('player'+this.id);
          }
          ulNode.append(div);
      });
      $('#OtherPlayersArea').empty().append(ulNode);
    }

    function drawGameItemsArea() {
        var ulNode = $("<ul id='GameItemsUlNode'>");
        $.each(GameItemsArray, function(){
              //ulNode.append("<li>"+this[0]+":"+this[1]+"</li>");
              var liNode = $("<li class='GameItems'>"+this[0]+":"+this[1]+"</li>");
              if(this[2] === 0){
                  liNode.attr('disabled', true);
              }
              ulNode.append(liNode);
        });
        $("#GameItemsArea").empty().append(ulNode);
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
              ulNode.append(liNode);
        });
        $("#FiledArea").empty().append(ulNode);
    }


    function bindClickEvent(){
      $('#GameItemsUlNode li').on('click', function(){
          var index = $('#GameItemsUlNode li').index(this);
          console.log(GameItemsArray[index][0]+','+GameItemsArray[index][1] +' is clicked!');
          Action.index_GameItems = index;
      });

      $('#FiledAreaNode li').on('click', function(){
          var index = $('#FiledAreaNode li').index(this);
          console.log(index+':'+FiledArray[index][0]+','+FiledArray[index][1] +' is clicked!');
          Action.index_Filed =index;
      });
    }

    $('#enter').click(function(){
        username = cleanInput($('.usernameInput').val().trim());
        if (username) {
            $('.loginForm').fadeOut("slow");
            $('.startForm').show();

            myPlayer.name = username;
            myPlayer.id = createPlayerID();
            PlayerArray.push(myPlayer);

            socket.emit('new player add', myPlayer);
        }
    });

    function createPlayerID(){
      var id = 1;
      for(var i=1; i <= MAX_PLAYER; i++){
          var found = false;
          for(var j=0; j < PlayerArray.length; j++){
              if(PlayerArray[j].id == i){
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


    $('#SubmitArea input:button').click(function(){
        //console.log("button clicked");
        var index_GameItems = Action.index_GameItems;
        var index_Filed = Action.index_Filed;
        console.log(index_GameItems+";"+index_Filed);

        updateGameStatus();

        socket.emit('submit', Action);

    });

    socket.on('update', function(data){
        Action = data;
        console.log('updated.'+Action.index_GameItems+';'+Action.index_Filed);

        updateGameStatus();

    });

    socket.on('players update', function(data){
        PlayerArray = data;
        console.log('players update: '+PlayerArray.length);
        drawLoginPage();
    });

    socket.on('start game', function(){
        $('.loginPage').fadeOut("slow");
        $('.wrap').show();
        initWrap();

        console.log('start game.');
    });

    function updateGameStatus(){
      var index_GameItems = Action.index_GameItems;
      var index_Filed = Action.index_Filed;
      GameItemsArray[index_GameItems][1] = GameItemsArray[index_GameItems][1] - 1;
      FiledArray[index_Filed][0] = GameItemsArray[index_GameItems][0];

      drawGameItemsArea();
      drawFiledArea();
      bindClickEvent();
    }


})
