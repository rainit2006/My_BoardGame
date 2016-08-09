/////////Global variables////////////
var BuildingAreaMaxNum = 12;
var PlantationAreaMaxNum = 12;

var Action={//记录玩家的操作
    index_GameItems:null,
    index_Filed:null,
    id:null
};
var MAX_PLAYER = 5;
var PLANTATION = ['corn', 'sugar', 'indigo', 'tabacco', 'coffee'];
var Players = [];
var myPlayer = {
    name: 'test',
    id: 0,
    select:null, //记录用户的选择
    points:0,
    money:0,
    totalColonists:0,
    freeColonists:0,
    quarry:0,
    // corn:0,
    // indigo:0,
    // sugar:0,
    // tabacco:0,
    // coffee:0,
    products:[1,0,1,0,0],//corn, sugar indigo, tabacco,coffee
    plantArea:[],
    buildArea:[]
};
var playerNum = 1;
var currentRole = null;
var options = null;


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
      drawPlayers();
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
      currentRole = $(this).data('role');
      var sendData={};
      sendData.role = currentRole;
      sendData.player = myPlayer;
      if(currentRole == 'Mayor'){
          myPlayer.freeColonists += 1;
      }
      socket.emit('gameRoleSelect', sendData);
    });


    socket.on('RoleResponse', function(data){
        currentRole = data.role;
        //plantOptions = null;
        console.log('RoleResponse:'+currentRole+';'+data.nextPlayer.name);
        if(data.player != null){
          var index = findPlayerbyName(data.player.name);
          Players[index] = data.player;
        }
        if(data.nextPlayer.name != myPlayer.name){
            console.log(data.nextPlayer.name+' is not '+myPlayer.name);
            return;
        }

        var titleString = currentRole;
        var contentString = "";
        //console.log("player name:"+myPlayer.name);
        switch (currentRole) {
          case 'Settler':
              options = data.options;
              //console.log('plant options:'+options);
              contentString = "请选择你想要的plant.";
              $('#message').empty().text(contentString);

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
                  $('#message').text(contentString).append("<p>你选择的是："+options[this.id].name+"</p>");
              });
              break;
          case 'Mayor':
              myPlayer.freeColonists += data.colonist;
              myPlayer.totalColonists += data.colonist;
              drawColonistList();
              break;
          case 'Trader':
              var bonus = 1;
              var tradingHouse = data.tradingHouse;
              drawTradingHouse(tradingHouse);

              options = [];
              for(var i=0; i<myPlayer.products.length; i++){
                  if(myPlayer.products[i] != 0){
                      if(!existInTradingHouse(i, tradingHouse)){
                          options.push(PLANTATION[i]);
                      }
                  }
              }
              if(options.length <= 0){
                  contentString = "没有可以贩卖的货物。";
              }else{
                  contentString = "请选择要贩卖的货物:";
              }
              $('#message').empty().text(contentString);

              var ulNode= $("<ul>");
              $.each(options, function(index){
                  //plantOptions.push(this.name);
                  var div = $("<li>"+options[index]+"</li>");
                  ulNode.append(div);
              });
              $('#element').empty().append(ulNode);

              $('#element li').on('click', function(){
                  ///判断操作的player是不是有效的当前player，如果是则传给服务器data。
                  console.log($(this).text());
                  //myPlayer.select = this;
                  //$('#message').text(contentString).append("<p>你选择的是："+options[this.id].name+"</p>");
              });
              break;
          case 'Captain':
              break;
          case 'Builder':
              break;
          case 'Craftsman':
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
                break;
            case 'Mayor':
                //没有什么特别要处理的
                break;
            default:
        }
        sendData.player = myPlayer;
        sendData.role = currentRole;
        console.log(sendData.index+':'+options[myPlayer.select].name+' is clicked!');
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
        console.log('players update: '+Players.length);
        drawLoginPage();
    });

    socket.on('next round', function(data){
        //change govenor player.
        console.log('next round');
    });

    socket.on('next role', function(data){
        //change next player to select one role.
        console.log('next role');
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
})
