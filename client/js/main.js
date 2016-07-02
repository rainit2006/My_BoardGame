$(function() {
    var GameItemsArray = [];


    window.onload = function(){
        init();
    }


    function init(){
      initGameItems();
      bindClickEvent();

      console.log("init done.");
    }

    function initGameItems(){
        GameItemsArray = [];
        GameItemsArray.push(["玉米", 5, 1]); // "1" stands for "Enable".
        GameItemsArray.push(["咖啡", 9, 1]);
        GameItemsArray.push(["item3", 3, 1]);
        GameItemsArray.push(["item4", 3, 0]);

        var ulNode = $("<ul id='GameItemsUlNode'>");
        $.each(GameItemsArray, function(){
              //ulNode.append("<li>"+this[0]+":"+this[1]+"</li>");
              var liNode = $("<li class='GameItems'>"+this[0]+":"+this[1]+"</li>");
              if(this[2] === 0){
                  liNode.attr('disabled', true);
              }
              ulNode.append(liNode);
        });
        $("#GameItemsArea").append(ulNode);
    }

    function bindClickEvent(){
      $('#GameItemsUlNode li').on('click', function(){
          var index = $('#GameItemsUlNode li').index(this);
          console.log(GameItemsArray[index][0]+','+GameItemsArray[index][1] +' is clicked!');
      });
    }

})
