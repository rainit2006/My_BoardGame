$(function() {
    var socket = io();

    var GameItemsArray = [];
    var FiledArray = [];
    var FiledLength = 10;
    var Action={//记录玩家的操作
        index_GameItems:null,
        index_Filed:null
    };

    window.onload = function(){
        init();
    }


    function init(){
      initGameItems();
      initFiled();
      drawGameItemsArea();
      drawFiledArea();
      bindClickEvent();

      console.log("init done.");
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
        FiledArray.push(["工厂", 2, 1]);
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
