///////////////////////////
function settlerProcess(data){
  options = data.options.arr1;
  extra = data.options.arr2;
  var quarryList = data.options.arr3;
  //console.log('plant options:'+options);
  if((myPlayer.PlantArea != null)&&(myPlayer.PlantArea.length >= PlantationAreaMaxNum)){
        var contentString = "你的农场空地已满，无法再选择了.";
        $('#message').empty().text(contentString);
        return;
  }
  var contentString = "请选择你想要的plant.";
  $('#message').empty().text(contentString);
  var ulNode= $("<ul id='PlantationUL'>");

  //如果玩家是拓荒者，则可以选择quarry
  if((quarryList.length > 0) && (rolePlayer == myPlayer.name)){
      var quarry = PLANTS[6];
      var div = $("<li id='q'>"+"<img src='../image/"+quarry.name+".png'>"+"</li>").addClass(quarry.color);
      ulNode.append(div);
  }
  //如果玩家不是拓荒者并拥有【建筑小屋】，则也可以选择quarry
  if((quarryList.length > 0) && (rolePlayer != myPlayer.name) && (containBuilding("construction hut"))){
      var quarry = PLANTS[6];
      var div = $("<li id='q'>"+"<img src='../image/"+quarry.name+".png'>"+"</li>").addClass(quarry.color);
      ulNode.append(div);
  }

  for(var i = 0; i < options.length; i++){
      //plantOptions.push(this.name);
      var div = $("<li id="+i+">"+"<img src='../image/"+options[i].name+".png'>"+"</li>").addClass(options[i].color);
      ulNode.append(div);
  }
  $('#element').empty().append(ulNode);

  ////如果有农庄，可以都多一个extra plantation
  var result = containBuilding('hacienda');
  if(result){
     var plant = extra[0];
     var node = $("<p>因为你拥有【农庄】，所以你多拥有一个<span class='"+plant.color+"'><img src='../image/"+plant.name+".png'></span></p>");
     $('#element').append(node);
     if((myPlayer.PlantArea != null)&&(myPlayer.PlantArea.length < (PlantationAreaMaxNum -1 ))){
        myPlayer.PlantArea.push(plant);
        mySelect.extra = plant.id;
     }
  }

  $('#element li').on('click', function(){
      ///判断操作的player是不是有效的当前player，如果是则传给服务器data。
      var ID = this.id;
      if(ID == 'q'){
          $('#message').text(contentString).append("<p>你选择的是：quarry.</p>");
          mySelect.select = PLANTS[6].id;
      }else{
          mySelect.select = options[ID].id;
          $('#message').text(contentString).append("<p>你选择的是："+options[ID].name+"</p>");
      }

  });
}
