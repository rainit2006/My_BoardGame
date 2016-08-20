///////////////////////////
function settlerProcess(data){
  options = data.options.arr1;
  extra = data.options.arr2;
  //console.log('plant options:'+options);
  if(myPlayer.PlantArea.length >= PlantationAreaMaxNum){
        var contentString = "你的农场空地已满，无法再选择了.";
        $('#message').empty().text(contentString);
        return;
  }
  var contentString = "请选择你想要的plant.";
  $('#message').empty().text(contentString);

  var ulNode= $("<ul id='PlantationUL'>");
  $.each(options, function(index){
      if(this.name == 'quarry'){
         if(rolePlayer != myPlayer.name){
              continue;
         }
      }
      //plantOptions.push(this.name);
      var div = $("<li id="+index+">"+this.name+"</li>").addClass(this.color);
      ulNode.append(div);
  });
  $('#element').empty().append(ulNode);

  ////如果有农庄，可以都多一个extra plantation
  if(containBuilding('hacienda')){
     var plant = extra[0];
     var node = $("<p>因为你拥有【农庄】，所以你多拥有一个<span class='"+plant.color+"'>"+plant.name+"</span></p>");
     $('#element').append(node);
     if(myPlayer.PlantArea.length < (PlantationAreaMaxNum -1 )){
        myPlayer.PlantArea.push(plant);
        mySelect.extra = plant.id;
     }
  }

  $('#element li').on('click', function(){
      ///判断操作的player是不是有效的当前player，如果是则传给服务器data。
      mySelect.select = this.id;
      $('#message').text(contentString).append("<p>你选择的是："+options[this.id].name+"</p>");
  });
}
