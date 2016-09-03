///////////////////////////
function settlerProcess(data){
  options = data.options.arr1;
  extra = data.options.arr2;
  var quarryList = data.options.arr3;
  //console.log('plant options:'+options);
  if((myPlayer.plantArea != null)&&(myPlayer.plantArea.length >= PlantationAreaMaxNum)){
        var contentString = "你的农场空地已满，无法再选择了.";
        $('#message').empty().text(contentString);
        return;
  }
  var contentString = "请选择你想要的种植园或采石场.";
  $('#message').empty().text(contentString);
  var ulNode= $("<div id='PlantationUL' class='flexBox-row'>");

  //如果玩家是拓荒者，则可以选择quarry
  if((quarryList.length > 0) && (rolePlayer == myPlayer.name)){
      var quarry = PLANTS[6];
      var div = $("<span class='flexBox-row'><input type='radio' name='filed' value ='q'><li class='"+quarry.color+"'><img src='../image/"+quarry.name+".png'></li></span>");
      ulNode.append(div);
  }
  //如果玩家不是拓荒者并拥有【建筑小屋】，则也可以选择quarry
  if((quarryList.length > 0) && (rolePlayer != myPlayer.name) && (containBuilding("construction hut"))){
      var quarry = PLANTS[6];
      var div = $("<span class='flexBox-row'><input type='radio' name='filed' value='q'><li class='"+quarry.color+"'><img src='../image/"+quarry.name+".png'></li>");
      ulNode.append(div);
  }

  for(var i = 0; i < options.length; i++){
      //plantOptions.push(this.name);
      var div = $("<span class='flexBox-row'><input type='radio' name='filed' value="+i+"><li class='"+options[i].color+"'><img src='../image/"+options[i].name+".png'></li></span>");
      ulNode.append(div);
  }
  $('#element').empty().append("<div id='selection'></div>").append(ulNode);

  ////如果有农庄，可以都多一个extra plantation
  if(containBuilding('hacienda')){
     var plant = extra[0];
     var node = $("<div><p>因为你拥有【农庄】，所以你多拥有一个种植园。</p><ul><li class='"+plant.color+"'><img src='../image/"+plant.name+".png'></li></ul></div>");

     if((myPlayer.plantArea != null)&&(myPlayer.plantArea.length < (PlantationAreaMaxNum -1 ))){
        //myPlayer.PlantArea.push(plant);
        mySelect.extra = plant.id;
        $('#element').append("<hr>").append(node);
     }
  }


  $(document).on('change', '[type=radio]', function(){
      if(currentRole != 'Settler'){
          return;
      }
      var ID = this.value;
      if(ID == 'q'){
          $('#selection').html("<h4>你选择的是：quarry</h4>");
          mySelect.select = PLANTS[6].id;
      }else{
          mySelect.select = options[ID].id;
          $('#selection').html("<h4>你选择的是："+options[ID].name+"</h4>");
      }

  });
}
