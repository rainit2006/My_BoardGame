function builderProcess(data){
    //console.log('plant options:'+options);
    mySelect = {select:null, extra:null};

    var bonus = 0;
    if(data.rolePlayer == myPlayer.name){
        bonus = 1;
    }
    var buildingsNum = data.buildingsNum;
    var selectDiv = $("<div  class='select-box01'></div>");
    var ulNode= $("<select id='buildList'>");
    ulNode.append("<option id='0'>请选择你想购买的建筑</option>");
    var flag = false;
    $.each(BUILDINGS, function(index){
        //plantOptions.push(this.name);
        if(index > 0){
            var build = BUILDINGS[index];
            if(build == null){
              console.log("err: build is null. index:" + index);
              return;
            }
            if(buildingsNum[index] > 0){
                var quarry = 0;
                var price = 0;
                var div = "";
                if(myPlayer.quarry <= build.quarry){
                    quarry = myPlayer.quarry;
                }else{
                    quarry = build.quarry;
                }
                var price = build.price - bonus - quarry;
                if(myPlayer.money >= price){
                    if( (BuildingAreaMaxNum - myPlayer.buildArea.length) >= build.space ){
                        div = $("<option id="+build.id+" value='"+price+"'>"+build.name+"。 需要花费金钱："+price+"</option>").addClass(this.color);
                        ulNode.append(div);
                        flag = true;
                    }
                }
            }
        }
    });
    selectDiv.append(ulNode);
    $('#element').empty().append(selectDiv);

    if(flag){
        contentString = "你拥有金钱:"+myPlayer.money+"。空地数量："+(BuildingAreaMaxNum - myPlayer.buildArea.length)+"。能购买的Building是：";
    }else{
        contentString = "你拥有金钱:"+myPlayer.money+"。空地数量："+(BuildingAreaMaxNum - myPlayer.buildArea.length)+"。目前没有你能购买的建筑。";
    }
    $('#message').empty().text(contentString);

    $('#buildList').change(function(){
        var id = $(this).children(':selected').attr('id');
        console.log("selected build is "+id);
        if(id == 0){
          return;
        }
        var price = $('#buildList').val();
        mySelect.select = [id, price];
        $('#message').text(contentString).append("<p>你选择的是："+BUILDINGS[id].name+".  价格："+price+"</p>");
    });
}
