///////////////////////////
function settlerProcess(data){
  options = data.options;
  //console.log('plant options:'+options);
  var contentString = "请选择你想要的plant.";
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
}
